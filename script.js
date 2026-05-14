const input = document.getElementById("input");
const output = document.getElementById("output");
const obfuscateBtn = document.getElementById("obfuscateBtn");
const cleanBtn = document.getElementById("cleanBtn");

function randomString(length) {
    const chars = "Il1O0abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";

    for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }

    return result;
}

function toBytes(str) {
    const bytes = [];

    for (let i = 0; i < str.length; i++) {
        bytes.push(str.charCodeAt(i));
    }

    return bytes;
}

function obfuscate(code) {
    const key = Math.floor(Math.random() * 200) + 20;

    const encoded = toBytes(code).map(b => b ^ key);

    const keyVar = randomString(12);
    const tableVar = randomString(12);
    const decodeFunc = randomString(12);
    const resultVar = randomString(12);
    const byteVar = randomString(12);

    return `--[[ Nebula Obfuscator ]]
local ${keyVar}=${key}
local ${tableVar}={${encoded.join(",")}}

local function ${decodeFunc}()
    local ${resultVar}={}

    for _,${byteVar} in ipairs(${tableVar}) do
        ${resultVar}[#${resultVar}+1]=string.char(bit32.bxor(${byteVar},${keyVar}))
    end

    return table.concat(${resultVar})
end

loadstring(${decodeFunc}())()
`;
}

obfuscateBtn.addEventListener("click", () => {
    const code = input.value;

    if (!code.trim()) {
        alert("Enter Luau code first.");
        return;
    }

    output.value = obfuscate(code);
});

cleanBtn.addEventListener("click", () => {
    input.value = "";
    output.value = "";
});
