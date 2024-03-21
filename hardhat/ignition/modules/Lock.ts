import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const HelloWorldModule = buildModule("HelloWorldModule", (m) => {
    const greeting = m.getParameter("greeting", "Hello World!");
    const a = m.getParameter("a", 0n);
    const b = m.getParameter("b", 0n);
    const count = m.getParameter("count", 0n);

    const helloWorld = m.contract("HelloWorld", [greeting, a, b, count]);

    return { helloWorld };
});

export default HelloWorldModule;
