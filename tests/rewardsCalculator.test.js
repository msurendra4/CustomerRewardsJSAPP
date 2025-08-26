
import { calculatePoints } from '../js/modules/rewardsCalculator.js';

test('Positive: $120 => 90 points', ()=>{ expect(calculatePoints(120)).toBe(90); });
test('Positive: $75 => 25 points', ()=>{ expect(calculatePoints(75)).toBe(25); });
test('Positive: $200 => 250 points', ()=>{ expect(calculatePoints(200)).toBe(250); });

test('Negative: $40 => 0 points', ()=>{ expect(calculatePoints(40)).toBe(0); });
test('Negative: fractional 100.5 => 51 points', ()=>{ expect(calculatePoints(100.5)).toBe(51); });
test('Negative: invalid/zero => 0', ()=>{ expect(calculatePoints(0)).toBe(0); });
