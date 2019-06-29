import {valueTest} from '../commands/bdo/value';

describe('Value Command', () => {

    describe('toMachineReadable', () => {
        test.each`
    input     | expectedResult
    ${'9.6bil'}  |  ${9600000000}
    ${'9.6b'} |     ${9600000000}
    ${'1k'} | ${1000}
    ${'10k'} | ${10000}
    ${'1mil'} | ${1000000}
    ${'10mil'} | ${10000000}
    ${'100mil'} |   ${100000000}
    ${'1m'} |  ${1000000}
    ${'10m'} | ${10000000}
    ${'100m'} | ${100000000}
  `('converts $input to $expectedResult', ({input, expectedResult}) => {
            expect(valueTest.toMachineReadable(input)).toBe(expectedResult)
        });
    });

    describe('toHumanReadable', () => {
        test.each`
   input | expectedResult
   ${1000000} | ${'1mil'}
   `('converts $input to $expectedResult', ({input, expectedResult}) => {
            expect(valueTest.toHumanReadable(input)).toBe(expectedResult);
        })
    });

    describe('startsWithNumber', () => {
        test.each`
        input | expectedResult
        ${'100bil'} | ${true}
        ${'b'} | ${false}
        ${'kkkkkkk2'} | ${false}
        ${12321321321} | ${true}
        ${'12123            2jkjl'} | ${true}
        `('Check if $input starts with a number', ({input, expectedResult}) => {
            expect(valueTest.startsWithNumber(input)).toBe(expectedResult);
        })
    })
});