const input =
document.getElementById("input");

const output =
document.getElementById("output");

const obfuscateBtn =
document.getElementById("obfuscateBtn");

const cleanBtn =
document.getElementById("cleanBtn");

const copyBtn =
document.getElementById("copyBtn");

function randomString(length = 20){

    const chars =
    "Il1O0ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    let result = "";

    for(let i = 0; i < length; i++){

        result += chars.charAt(
            Math.floor(
                Math.random() * chars.length
            )
        );

    }

    return result;
}

function randomNoise(){

    const noise = [];

    const count =
    Math.floor(Math.random() * 8) + 8;

    for(let i = 0; i < count; i++){

        noise.push(
            `"${randomString(40)}"`
        );

    }

    return noise.join(",");
}

function encodeString(str,key){

    let result = [];

    for(let i = 0; i < str.length; i++){

        const encoded =
        str.charCodeAt(i)
        ^
        key.charCodeAt(
            i % key.length
        );

        result.push(
            "\\" + encoded
        );

    }

    return result.join("");
}

function splitChunks(str){

    const chunks = [];

    let index = 0;

    while(index < str.length){

        const size =
        Math.floor(
            Math.random() * 30
        ) + 15;

        chunks.push(
            str.slice(
                index,
                index + size
            )
        );

        index += size;
    }

    return chunks;
}

function obfuscate(code){

    const key =
    randomString(35);

    const encoded =
    encodeString(code,key);

    const chunks =
    splitChunks(encoded);

    const fakeVars = [];

    for(let i = 0; i < 25; i++){

        fakeVars.push(`
local ${randomString(25)} = {
${randomNoise()}
}
`);

    }

    const tableName =
    randomString(25);

    const keyName =
    randomString(25);

    const decodeName =
    randomString(25);

    const resultName =
    randomString(25);

    const byteName =
    randomString(25);

    const chunkTable =
    chunks.map(
        x => `"${x}"`
    ).join(",");

    return `--[[ 
    Obfuscated by Nebula Obfuscator
    https://justsomeguest.github.io/
]]

return(function(...)

${fakeVars.join("\n")}

local ${keyName} =
"${key}"

local ${tableName} = {
${chunkTable}
}

local function ${decodeName}()

local ${resultName} = ""

for _,${byteName}
in ipairs(${tableName}) do

${resultName} =
${resultName}
..
${byteName}

end

local ${randomString(20)} = 1

local ${randomString(20)} = ""

while ${randomString(20)}
<= #${resultName} do

local ${randomString(20)} =
string.sub(
${resultName},
${randomString(20)},
${randomString(20)}
)

${randomString(20)} =
${randomString(20)}

${randomString(20)} =
${randomString(20)}

break

end

return loadstring(
(function()

local ${randomString(20)} = ""

local ${randomString(20)} = 1

while ${randomString(20)}
<= #${resultName} do

if string.sub(
${resultName},
${randomString(20)},
${randomString(20)}
) == "\\\\" then

${randomString(20)} =
${randomString(20)} + 1

local ${randomString(20)} =
""

while ${randomString(20)}
<= #${resultName} do

local ${randomString(20)} =
string.sub(
${resultName},
${randomString(20)},
${randomString(20)}
)

if tonumber(
${randomString(20)}
) == nil then
break
end

${randomString(20)} =
${randomString(20)}
..
${randomString(20)}

${randomString(20)} =
${randomString(20)} + 1

end

${randomString(20)} =
${randomString(20)}
..
string.char(

tonumber(
${randomString(20)}
)

~

string.byte(
${keyName},
(
(
#${randomString(20)}
)
%
#${keyName}
)
+1
)

)

else

${randomString(20)} =
${randomString(20)} + 1

end

end

return ${randomString(20)}

end)()
)()

end

return ${decodeName}()

end)(...)
`;
}

obfuscateBtn.onclick = function(){

    const code =
    input.value;

    if(code.trim() === ""){

        alert(
            "Enter Luau code first."
        );

        return;
    }

    output.value =
    obfuscate(code);
};

cleanBtn.onclick = function(){

    input.value = "";
    output.value = "";
};

copyBtn.onclick = async function(){

    if(
        output.value.trim() === ""
    ) return;

    await navigator.clipboard.writeText(
        output.value
    );

    copyBtn.innerText =
    "Copied";

    setTimeout(() => {

        copyBtn.innerText =
        "Copy";

    },1200);

};
