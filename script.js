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

    const keyVar =
    randomString(24);

    const tableVar =
    randomString(24);

    const dataVar =
    randomString(24);

    const outVar =
    randomString(24);

    const iVar =
    randomString(24);

    const numVar =
    randomString(24);

    const charVar =
    randomString(24);

    const decoderFunc =
    randomString(24);

    const loaderVar =
    randomString(24);

    const decodedByteVar =
    randomString(24);

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

local ${keyVar}="${key}"

local ${tableVar}={
${chunkTable}
}

local function ${decoderFunc}()

    local ${dataVar}=""

    for _,v in ipairs(${tableVar}) do
        ${dataVar}=${dataVar}..v
    end

    local ${outVar}=""
    local ${iVar}=1

    while ${iVar}<=#${dataVar} do

        if string.sub(
            ${dataVar},
            ${iVar},
            ${iVar}
        )=="\\\\" then

            ${iVar}=${iVar}+1

            local ${numVar}=""

            while ${iVar}<=#${dataVar} do

                local ${charVar}=
                string.sub(
                    ${dataVar},
                    ${iVar},
                    ${iVar}
                )

                if tonumber(
                    ${charVar}
                )==nil then
                    break
                end

                ${numVar}=
                ${numVar}
                ..
                ${charVar}

                ${iVar}=
                ${iVar}+1

            end

            local ${decodedByteVar}=
            bit32.bxor(

                tonumber(
                    ${numVar}
                ),

                string.byte(

                    ${keyVar},

                    (
                        (
                            #${outVar}
                        )
                        %
                        #${keyVar}
                    )
                    +1

                )

            )

            ${outVar}=
            ${outVar}
            ..
            string.char(
                ${decodedByteVar}
            )

        else

            ${iVar}=
            ${iVar}+1

        end

    end

    return ${outVar}

end

local ${loaderVar}=
(loadstring or load)

return ${loaderVar}(
    ${decoderFunc}()
)()

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
