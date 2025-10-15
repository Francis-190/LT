const cds = require('@sap/cds');

module.exports = cds.service.impl(function (req) {


  this.on('READ', 'Billings', async (req,res) => {

    // if (req.path!=='Billings'){
    //   console.log('path wrong');
    //    return 'resource wrong'
      
    // }

    console.log('target Name: ',req.target.name);
    const results = await cds.run(SELECT.from('billing.Billings'));
    return results;
  });

  this.on('calculateDealerCount', async (req) => {
    const dealers = await cds.run(SELECT.from('billing.Dealer'));
    return `Total dealers: ${dealers.length}`;
  });

  

});
