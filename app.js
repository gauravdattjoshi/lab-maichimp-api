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
console.log(process.env.MAILCHIMP_API_KEY,process.env.SERVER_PREFIX,process.env.LIST_ID);

async function run(email_address, FNAME, LNAME) {
    console.log(email_address, LNAME);
    try {
        const response = await mailChimp.lists.addListMember(process.env.LIST_ID, {
            email_address,
            status: 'subscribed',
            merger_fields: {
                FNAME:FNAME, LNAME:LNAME
            }
        })
        return response;
    } catch (error) {
        console.log(error);
    }

}



//homepage
app.get('', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});



//post request


app.post('/submit', async(req, res) => {
    const body = req.body;
    console.log(req.body.email_address, body.email_address);
    const result = await run(
        body.email_address,
        body.first_name, body.last_name
    );
    res.send(`<h1>Successfully added contact as an audience member. The contact's id is ${result.id}</h1>`)

})



//start server
app.listen(PORT, (err, res) => {
    try {
        console.log('server started at port 3000');
    } catch (error) {
        console.log(err)
    }
});