var nrc = require('node-run-cmd');
var dataG = '';
nrc.run(`netstat -ano`, {
    onData: dataCallback,
    onDone: doneCB
});

function dataCallback(data) {
    dataG += data
}

function doneCB(data) {
    if (dataG) {
        var arr = dataG.split("\r\n");
        if (arr && arr.length) {
            arr.forEach(item => {
                let rw = item.replace(/ /g, '-').split("\t\t");
                //console.log("-----", rw[0]);
                if (rw[0].indexOf(']:3000') > 0) {
                    let pid = rw[0].trim().substr(rw[0].length - 4);
                    console.log(pid);
                    nrc.run(`taskkill /F /PID ${pid}`);
                }
            })
        }
    }
}