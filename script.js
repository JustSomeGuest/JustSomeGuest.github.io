const input = document.getElementById("input");

    for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }

    return result;
}

function toByteArray(str) {
    const bytes = [];

    for (let i = 0; i < str.length; i++) {
        bytes.push(str.charCodeAt(i));
    }

    return bytes;
}

function generateDecoder(byteTable, key) {
    return `
local ${randomString(10)}=${key}
local ${randomString(10)}={${byteTable.join(",")}}

local function ${randomString(12)}(${randomString(5)})
    local ${randomString(5)}={}

    for _,${randomString(5)} in ipairs(${randomString(5)}) do
        table.insert(${randomString(5)},string.char(bit32.bxor(${randomString(5)},${key})))
    end

    return table.concat(${randomString(5)})
end

loadstring(${randomString(12)}(${randomString(10)}))()
`;
}

function obfuscate(code) {
    const key = Math.floor(Math.random() * 200) + 20;
    const bytes = toByteArray(code).map(b => b ^ key);

    let stub = generateDecoder(bytes, key);

    stub = stub
        .replace(/\n/g, " ")
        .replace(/\s+/g, " ");

    return `--[[ Nebula Obfuscator ]] ${stub}`;
}

obfuscateBtn.addEventListener("click", () => {
    const code = input.value;

    if (!code.trim()) {
        alert("Please enter Luau code.");
        return;
    }

    output.value = obfuscate(code);
});

cleanBtn.addEventListener("click", () => {
    input.value = "";
    output.value = "";
});
