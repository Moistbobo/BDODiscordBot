import replace from '../tools/replace';

it('should replace a placeholder string correctly', ()=>{
   const placeholder = "Hello, my name is {0} and I am from {1}";
   const valueOne = "Rawhide Kobayashi";
   const valueTwo = "Japan";

   const expectedValue = "Hello, my name is Rawhide Kobayashi and I am from Japan";

   const replacedValue = replace(placeholder, [valueOne, valueTwo]);

   expect(replacedValue).toBe(expectedValue);
});