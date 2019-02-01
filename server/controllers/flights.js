var http = require('http')

module.exports  = {
    testDjango : function(req, res){
        
        http.get('http://127.0.0.1:8000', (resp) => {
        let data = ''
        resp.on('data', (chunk) => {
            // console.log(chunk)
            data += chunk
            console.log(data)
        })

        resp.on('end', () => {
            // console.log(data);
            res.json({message : data})
        });
    })
    }

}