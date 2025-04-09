const { expect } = require("chai");

describe("SimpleWallet", function () {
  it("Should deploy and receive ether", async function () {
    const [owner] = await ethers.getSigners();
    const Wallet = await ethers.getContractFactory("SimpleWallet");
    const wallet = await Wallet.deploy();
    await wallet.deployed();

    await owner.sendTransaction({
      to: wallet.address,
      value: ethers.utils.parseEther("1.0"),
    });

    expect(await wallet.getBalance()).to.equal(ethers.utils.parseEther("1.0"));
  });

  it("Should allow only owner to withdraw", async function () {
    const [owner, other] = await ethers.getSigners();
    const Wallet = await ethers.getContractFactory("SimpleWallet");
    const wallet = await Wallet.deploy();
    await wallet.deployed();

    await owner.sendTransaction({
      to: wallet.address,
      value: ethers.utils.parseEther("1.0"),
    });

    await expect(
      wallet.connect(other).withdraw(ethers.utils.parseEther("0.5"))
    ).to.be.revertedWith("Not the owner");

    await wallet.connect(owner).withdraw(ethers.utils.parseEther("0.5"));
    expect(await wallet.getBalance()).to.equal(ethers.utils.parseEther("0.5"));
  });
});
