
app.get("/" , (req, res) => {
    res.sendFile("/index.html");
});

app.get("/api/shops" , (req, res) => {
    res.sendFile('/stores.json', 'utf8', (err, data) => {
        if(err) {
            return res.status(500).send({message: err});
        } try {
            const jsonData = JSON.parse(data);
            res.send(jsonData);
        } catch(err) {
            return res.status(500).send({message: err});
        }
    }
   )});