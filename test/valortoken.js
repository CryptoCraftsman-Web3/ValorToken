const ValorToken = artifacts.require('./ValorToken.sol');


contract('ValorToken', function ([_, owner, recipient, anotherAccount]) {
  beforeEach(async function () {
    this.token = await ValorToken.new({ from: owner });
  });


      describe('this testcase is a placeholder', function () {
        it('and will fail', async function () {
          assert.equal(true, false);
        });

        it('and fail again', async function () {

          assert.equal(true,false);
        });
      });

 
});