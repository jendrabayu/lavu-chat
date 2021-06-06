import { RSA } from '../crypto'
import bigInt from 'big-integer'


/**
 * 
 * Menghasilkan kunci RSA dan DIffie Helman untuk 2 user
 * 1. e
 * 2. n
 * 3. d 
 * 4. R : r
 * 5. T : t
 * 6. x : x
 * 7. X : big_x
 */

export const generateKey = () => {
  // a & b masing-masing menghasilkan kunci RSA (e, n) public, (d, n) private
  const a = RSA.generate(256);
  const b = RSA.generate(256);

  // mencari R1 & R2 , Rn < en (private)
  const R1 = bigInt(999, a.e);
  const R2 = bigInt(999, b.e);

  // mencari T1 & T2 (public)
  const T1 = RSA.encrypt(R1.toString(), b.n, b.e);
  const T2 = RSA.encrypt(R2.toString(), a.n, a.e);

  // mencari x & y (private)
  const x = bigInt.randBetween(99, 999);
  const y = bigInt.randBetween(99, 999);

  const Q = R1.multiply(R2);
  const P = a.n.modPow(b.n, a.e.multiply(b.e));

  // mencari nilai X & Y
  const X = P.modPow(x, Q);
  const Y = P.modPow(y, Q);

  return {
    a: {
      e: a.e.toString(),
      n: a.n.toString(),
      d: a.d.toString(),
      r: R1.toString(),
      t: T1.toString(),
      x: x.toString(),
      big_x: X.toString()
    },
    b: {
      e: b.e.toString(),
      n: b.n.toString(),
      d: b.d.toString(),
      r: R2.toString(),
      t: T2.toString(),
      x: y.toString(),
      big_x: Y.toString()
    }
  }
}