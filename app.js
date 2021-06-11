const mailChimp = require('@mailchimp/mailchimp_marketing');
const express = require('express');

const PORT = process.env.PORT || 3000
const app = express();
app.use(express.urlencoded({ extended: true }));


//MailChimp Details
mailChimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: process.env.SERVER_PREFIX,

});


//homepage
app.get('', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});


//post request
app.post('/submit', async (req, res) => {

    const body = req.body;
    try {

        await mailChimp.lists.addListMember(process.env.LIST_ID, {
            email_address: body.email_address,
            status: 'subscribed',
            merger_fields: {
                FNAME: body.first_name, LNAME: body.last_name
            }
        })



        if (res.statusCode === 200) {
            res.sendFile(__dirname + '/success.html')
        } else {
            res.sendFile(__dirname + '/failure.html')
        }

    } catch (error) {
        res.sendFile(__dirname + '/failure.html');
    }

})

app.post('/failure', (req, res) => {
    res.redirect('/');
})


//start server
app.listen(PORT, (err, res) => {
    try {
        console.log('server started at port 3000');
    } catch (error) {
        console.log(err)
    }
});