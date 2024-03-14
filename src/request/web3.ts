class InnoWeb3 {
    static self: InnoWeb3 | null = null;
    web3: any = null;

    static getSelf(): InnoWeb3 {
        if (InnoWeb3.self === null) {
            InnoWeb3.self = new InnoWeb3();
        }
        return InnoWeb3.self;
    }

    getWeb3(): any {
        return this.web3;
    }
}

export default InnoWeb3;