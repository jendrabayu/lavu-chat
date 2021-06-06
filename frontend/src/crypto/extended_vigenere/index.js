export class EV {

  static mod(n, m) {
    return ((n % m) + m) % m;
  };

  static textToIntList(text) {
    const intList = [];

    for (let i = 0; i < text.length; i++) {
      intList.push(text.charCodeAt(i));
    }

    return intList;
  };

  static intListToCharList(intList) {
    const charList = [];

    intList.forEach((integer) => {
      charList.push(String.fromCharCode(integer));
    });

    return charList;
  };

  static intListToText(intList) {
    return this.intListToCharList(intList).join("");
  };

  static encrypt(plaintext, key) {
    const output = [];

    const kt = this.textToIntList(key);
    var pt = (typeof (plaintext) === 'object' ? Object.values(plaintext) : this.textToIntList(plaintext));
    for (let i = 0; i < pt.length; i++) {
      const k = kt[i % kt.length] - 97;
      output.push(this.mod(pt[i] + k, 256));
    }

    return this.intListToText(output);
  };

  static decrypt(cipher, key) {
    const output = [];

    var ct = (typeof (cipher) === 'object' ? Object.values(cipher) : this.textToIntList(cipher));
    const kt = this.textToIntList(key);

    for (let i = 0; i < ct.length; i++) {
      const k = kt[i % kt.length] - 97;
      output.push(this.mod(ct[i] - k, 256));
    }

    return this.intListToText(output);
  };

}
