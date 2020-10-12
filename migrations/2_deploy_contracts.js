var art = artifacts.require("MyToken");
module.exports = deployer => {
    deployer.deploy(art, 100, 'MyToken', 'MT');
};