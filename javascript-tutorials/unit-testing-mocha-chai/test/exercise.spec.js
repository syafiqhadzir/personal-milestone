const { User } = require('../src/exercise');
const axios = require('axios');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
// const mock = require('mock.json');
const expect = chai.expect;
chai.use(sinonChai);

describe('the User Class', () => {
    const sandbox = sinon.createSandbox();
    let user;

    beforeEach(() => {
        user = new User('syafiqhadzir');
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Should get the user id', (done) => {
        // console.log(dataMock);
        const getStub = sandbox.stub(axios, 'get').resolves({ data: { "id": 1234 } });
        user.getUserId()
            .then(result => {
                expect(result).to.be.a('number');
                expect(result).to.be.eq(1234);
                expect(getStub).to.have.been.calledOnce;
                expect(getStub).to.have.been.calledWith('https://api.github.com/users/syafiqhadzir');
                done();
            })
            .catch(done);
    });

    it('Should return a repository if the user can view repos', (done) => {
        const getStub = sandbox.stub(axios, 'get').resolves({ data: ['repo1', 'repo2', 'repo3'] });
        sandbox.stub(user, 'canViewRepos').value(true);
        user.getUserRepo(2)
            .then(response => {
                expect(response).to.be.eq('repo3');
                expect(getStub).to.have.been.calledOnceWith('https://api.github.com/users/syafiqhadzir/repos');
                done();
            })
            .catch(done);
    });

    it('Should return an error if the user cannot view repos', (done) => {
        const getStub = sandbox.stub(axios, 'get');
        sandbox.stub(user, 'canViewRepos').value(false);

        user.getUserRepo(2)
            .catch(error => {
                expect(error).to.be.eq('Cannot view repos');
                expect(getStub).to.not.have.been.called;
                done();
            });
    });
});