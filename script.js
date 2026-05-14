const input = document.getElementById("input");
const output = document.getElementById("output");

const obfuscateBtn = document.getElementById("obfuscateBtn");
const cleanBtn = document.getElementById("cleanBtn");

function randomString(length) {
    const chars = "Il1O0abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    let result = "";

    for (let i = 0; i < length; i++) {
        result += chars.charAt(
            Math.floor(Math.random() * chars.length)
        );
    }

    return result;
}

function stringToBytes(str) {
    const bytes = [];

    for (let i = 0; i < str.length; i++) {
        bytes.push(str.charCodeAt(i));
    }

    return bytes;
}

function obfuscate(code) {

    const xorKey = Math.floor(Math.random() * 200) + 20;

    const encodedBytes = stringToBytes(code).map(byte => byte ^ xorKey);

    const keyVar = randomString(10);
    const tableVar = randomString(10);
    const decodeFunc = randomString(10);
    const resultVar = randomString(10);
    const byteVar = randomString(10);

    const obfuscated = `--[[ Nebula Obfuscator ]]

local ${keyVar} = ${xorKey}

local ${tableVar} = {${encodedBytes.join(",")}}

local function ${decodeFunc}()

    local ${resultVar} = {}

    for _, ${byteVar} in ipairs(${tableVar}) do
        ${resultVar}[#${resultVar} + 1] =
            string.char(
                bit32.bxor(${byteVar}, ${keyVar})
            )
    end

    return table.concat(${resultVar})

end

loadstring(${decodeFunc}())()
`;

    return obfuscated;
}

obfuscateBtn.onclick = function () {

    const code = input.value;

    if (code.trim() === "") {
        alert("Enter Luau code first.");
        return;
    }

    const result = obfuscate(code);

    output.value = result;
};

cleanBtn.onclick = function () {

    input.value = "";
    output.value = "";
};
