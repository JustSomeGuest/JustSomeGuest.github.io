const input = document.getElementById("input");
const output = document.getElementById("output");
const obfuscateBtn = document.getElementById("obfuscateBtn");
const cleanBtn = document.getElementById("cleanBtn");
const copyBtn = document.getElementById("copyBtn");

function randomString(length = 20) {
  const first = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const rest = "Il1O0ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = first.charAt(Math.floor(Math.random() * first.length));
  for (let i = 1; i < length; i++) {
    result += rest.charAt(Math.floor(Math.random() * rest.length));
  }
  return result;
}

function randomNoise() {
  const noise = [];
  const count = Math.floor(Math.random() * 10) + 10;
  for (let i = 0; i < count; i++) {
    noise.push(`"${randomString(50)}"`);
  }
  return noise.join(",");
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function xorEncrypt(text, key) {
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const x = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    out += String.fromCharCode(x);
  }
  return out;
}

function bytesToHex(bytes) {
  return Array.from(bytes)
    .map(b => b.charCodeAt(0).toString(16).padStart(2, "0"))
    .join("");
}

function hexSubstitute(hex, map) {
  return hex
    .split("")
    .map(c => map[c] || c)
    .join("");
}

function invertMap(map) {
  const inv = {};
  for (const [k, v] of Object.entries(map)) {
    inv[v] = k;
  }
  return inv;
}

function junkFunction() {
  const name = randomString(20);
  const localVars = [];
  for (let i = 0; i < randInt(2, 5); i++) localVars.push(randomString(10));
  return `
local function ${name}(${localVars.join(",")})
  local ${randomString(8)} = ${randInt(1,1000)}
  local ${randomString(8)} = {${randomNoise()}}
  for i=1, #${randomString(8)} do
    ${localVars[0] || "_"} = (${localVars[0] || "_"} or 0) + i
  end
  return ${localVars[0] || "nil"}
end`;
}

function junkIfBlock() {
  return `
if true then
  local ${randomString(10)} = "${randomString(30)}"
  local ${randomString(10)} = ${randInt(0, 999)}
end`;
}

function junkLoop() {
  return `
for _ = 1, ${randInt(1, 5)} do
  local ${randomString(8)} = ${randInt(0, 100)}
end`;
}

function junkTableConcat() {
  const t = randomString(12);
  const v = randomString(10);
  return `
local ${t} = {${Array.from({length: randInt(2, 5)}, () => `"${randomString(15)}"`).join(",")}}
local ${v} = table.concat(${t}, "")`;
}

function createChunkStorage(chunks) {
  const n = chunks.length;
  const perm = [...Array(n).keys()];
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  const storage = new Array(n);
  const orderExprs = new Array(n);
  for (let i = 0; i < n; i++) {
    const storeIdx = perm[i];
    storage[storeIdx] = chunks[i];
    const a = randInt(1, 20);
    const b = randInt(1, 20);
    const target = storeIdx + 1;
    const c = target - a * b;
    orderExprs[i] = `(${a} * ${b} + ${c})`;
  }
  return { storage, orderExprs };
}

function computeChecksum(str) {
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    sum = (sum + str.charCodeAt(i)) % 65521;
  }
  return sum;
}

function obfuscate(code) {
  const key1 = randomString(randInt(32, 64));
  const encrypted1 = xorEncrypt(code, key1);
  const key2 = key1.split("").reverse().join("");
  const encrypted2 = xorEncrypt(encrypted1, key2);
  const hex = bytesToHex(encrypted2);
  const hexChars = "0123456789abcdef";
  const shuffled = hexChars
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
  const subMap = {};
  for (let i = 0; i < hexChars.length; i++) {
    subMap[hexChars[i]] = shuffled[i];
  }
  const substitutedHex = hexSubstitute(hex, subMap);
  const invSubMap = invertMap(subMap);
  const checksum = computeChecksum(substitutedHex);
  const chunkSizes = [];
  let pos = 0;
  while (pos < substitutedHex.length) {
    const size = randInt(20, 40);
    chunkSizes.push(size);
    pos += size;
  }
  if (pos > substitutedHex.length) {
    const diff = pos - substitutedHex.length;
    chunkSizes[chunkSizes.length - 1] -= diff;
  }
  const chunks = [];
  let idx = 0;
  for (const sz of chunkSizes) {
    chunks.push(substitutedHex.slice(idx, idx + sz));
    idx += sz;
  }

  const { storage, orderExprs } = createChunkStorage(chunks);

  const junkBlocks = [];
  const junkCount = randInt(40, 70);
  for (let i = 0; i < junkCount; i++) {
    const roll = Math.random();
    if (roll < 0.4) junkBlocks.push(junkFunction());
    else if (roll < 0.7) junkBlocks.push(junkIfBlock());
    else if (roll < 0.9) junkBlocks.push(junkLoop());
    else junkBlocks.push(junkTableConcat());
  }

  const key1Var = randomString(20);
  const key2Var = randomString(20);
  const subMapVar = randomString(20);
  const invSubMapVar = randomString(20);
  const chunkTableVar = randomString(20);
  const orderTableVar = randomString(20);
  const decodeFuncVar = randomString(20);
  const loadVar = randomString(20);
  const resultVar = randomString(20);
  const checksumVar = randomString(20);

  const luaCode = `--[[
 Obfuscated by Nebula Obfuscator
 https://justsomeguest.github.io/
--]]

return (function(...)
  ${junkBlocks.join("\n  ")}

  local ${key1Var} = "${key1}"
  local ${key2Var} = "${key2}"

  local ${subMapVar} = {${Object.entries(subMap).map(([k,v]) => `["${k}"]="${v}"`).join(",")}}
  local ${invSubMapVar} = {${Object.entries(invSubMap).map(([k,v]) => `["${k}"]="${v}"`).join(",")}}

  local ${chunkTableVar} = {
    ${storage.map(c => `"${c}"`).join(",\n    ")}
  }

  local ${orderTableVar} = {
    ${orderExprs.join(",\n    ")}
  }

  local ${checksumVar} = ${checksum}

  local function ${decodeFuncVar}()
    local ordered = {}
    for idx = 1, #${orderTableVar} do
      local realIdx = ${orderTableVar}[idx]
      ordered[idx] = ${chunkTableVar}[realIdx]
    end
    local combined = table.concat(ordered)

    local sum = 0
    for i = 1, #combined do
      sum = (sum + string.byte(combined, i)) % 65521
    end
    if sum ~= ${checksumVar} then
      return "return function() end"
    end

    local unsubbed = ""
    for i = 1, #combined do
      local c = string.sub(combined, i, i)
      unsubbed = unsubbed .. (${invSubMapVar}[c] or c)
    end

    local bytes = ""
    for i = 1, #unsubbed, 2 do
      local byte = tonumber(string.sub(unsubbed, i, i+1), 16)
      bytes = bytes .. string.char(byte)
    end

    local step1 = ""
    for i = 1, #bytes do
      local b = string.byte(bytes, i)
      local k = string.byte(${key2Var}, ((i-1) % #${key2Var}) + 1)
      step1 = step1 .. string.char(bit32.bxor(b, k))
    end

    local original = ""
    for i = 1, #step1 do
      local b = string.byte(step1, i)
      local k = string.byte(${key1Var}, ((i-1) % #${key1Var}) + 1)
      original = original .. string.char(bit32.bxor(b, k))
    end

    return original
  end

  local ${loadVar} = (loadstring or load)
  local ${resultVar} = ${loadVar}(${decodeFuncVar}())
  if ${resultVar} then
    return ${resultVar}(...)
  end
end)(...)`;

  return luaCode;
}

obfuscateBtn.onclick = function () {
  const code = input.value;
  if (code.trim() === "") {
    alert("Enter Luau code first.");
    return;
  }
  output.value = obfuscate(code);
};

cleanBtn.onclick = function () {
  input.value = "";
  output.value = "";
};

copyBtn.onclick = async function () {
  if (output.value.trim() === "") return;
  await navigator.clipboard.writeText(output.value);
  copyBtn.innerText = "Copied";
  setTimeout(() => {
    copyBtn.innerText = "Copy";
  }, 1200);
};
