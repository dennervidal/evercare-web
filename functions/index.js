const functions = require('firebase-functions');
const admin = require('firebase-admin');
const moment = require('moment');
admin.initializeApp(functions.config().firebase);

exports.addMessage = functions.https.onRequest((req, res) => {
    // Grab the text parameter.
    const sdata = req.query.sdata;
    const device = req.query.device;
    const stime = req.query.stime;

    const ftime = moment.unix(stime).format("DD-MM-YYYY-hh-mm-ss");
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    admin.database().ref('/temp').push({data: sdata, device: device, time: ftime}).then(snapshot => {
        // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
        res.send(ftime);
    });

});

exports.updateData = functions.database.ref('/temp/{pushId}')
    .onWrite(event => {
        const read = event.data.val();
        const updateElder = admin.database().ref(`/dispositivos/${read.device}/idoso`).once('value');
        const tokenOwner = admin.database().ref(`/dispositivos/${read.device}/tokenOwner`).once('value');
        const updateDB = admin.database().ref('/idosos').orderByChild('dispositivo').equalTo(read.device).once('value');

        return Promise.all([updateDB, updateElder, tokenOwner]).then(results => {
            const elderId = results[1].val();
            const token = results[2].val();
            const data = [read.data.substr(0, 4), read.data.substr(4, 4), read.data.substr(8, 4)];
            data.forEach(item => {
                if (item[0].toLowerCase() === 't') {
                    //temp
                    const valor = item.substr(1, 2) + '.' + item.substr(3, 1); //start, lenght
                    results[0].ref.child(elderId).child("leituras").child("temperatura").child(read.time).child("valor").set(parseFloat(valor));
                } else if (item[0].toLowerCase() === 'b') {
                    //bpm
                    const valor = item.substr(1, 3);
                    results[0].ref.child(elderId).child("leituras").child("batimento").child(read.time).child("valor").set(parseInt(valor, 10));
                } else if (item[0].toLowerCase() === 'q') {
                    //queda
                    const payload = {
                        notification: {
                            title: 'Atenção!',
                            body: `Queda detectada`
                        }
                    };
                    // Send notifications to all tokens.
                    admin.messaging().sendToDevice(token, payload).then(response => {
                        console.log("notificação enviada");
                    });
                    results[0].ref.child(elderId).child("leituras").child("queda").child(read.time).child("valor").set(true);
                } else if (item[0].toLowerCase() === 'p') {
                    //passo
                    const valor = item.substr(1, 3);
                    results[0].ref.child(elderId).child("leituras").child("passo").child(read.time).child("valor").set(parseInt(valor, 10));
                } else if (item[0].toLowerCase() === 'l') {
                    const valor = read.data.substr(2, 10); //start, lenght
                    let axis = '';
                    if (item[1].toLowerCase() === 'a') {
                        axis = '1';
                    } else {
                        axis = '2';
                    }
                    results[0].ref.child(elderId).child("leituras").child("local")
                        .child(read.time.substr(0, 16) + '-00').child(`valor${axis}`).set(valor);
                }
            });

        });
    });
