const cds = require('@sap/cds');
const xsenv = require('@sap/xsenv');

xsenv.readServices = () => services.VCAP_SERVICES;

module.exports = cds.service.impl(async function () {
    const { Foo } = this.entities;

    this.on('READ', Foo, async (req) => {
        try {
            
            const des = await cds.connect.to('BILLING_SIMPLIFICATION');
            console.log('Destination connected:', des.name || des);

            const response = await des.send({
                method: 'GET',
                path: '/odata/v4/my'
            });

            console.log('Response from external service:', response);

            return response.value || response; 
        } catch (err) {
            console.error('Error fetching data from external service:', err);
            req.error(500, 'Failed to retrieve data from BILLING_SIMPLIFICATION');
        }
    });
});
