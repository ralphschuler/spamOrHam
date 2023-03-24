import brain from 'brain.js';
import { data as trainingData} from './data/trainingData.json';
import readline from 'readline';

type TokenCollection = Set<string>;
type TrainingData = Array<{
  input: string;
  isSpam: boolean;
}>

const network = new brain.NeuralNetwork({
  binaryThresh: 0.5,
  hiddenLayers: [3], // array of ints for the sizes of the hidden layers in the network
  activation: 'sigmoid', // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
  leakyReluAlpha: 0.01, // supported for activation type 'leaky-relu'
});

function buildDictionary(tokens: TokenCollection) {
  console.log("Building dictionary...");
  const dictionary = new Map<string, number>();

  tokens.forEach((token, index) => {
    const tokenHash = hash(token);
    dictionary.set(token, tokenHash);
    console.log(`Dictionary: ${token} >> ${tokenHash}`);
  });

  return dictionary;
}

function collectTokens(data: TrainingData): TokenCollection {
  console.log("Collecting tokens...");
  const tokens = new Set<string>();

  data.forEach(({ input }) => {
    input.split(" ").forEach(token => {
      if (token.length === 0 || tokens.has(token)) {
        return;
      }
      tokens.add(token);
      console.log(`Token: ${token}`);
    });
  });

  return tokens;
}

function tokenize(input: string): Array<number> {
  return input.split(" ").map(token => hash(token));
}

function hash(input: string): number {
  let hash = 0;

  for (let i = 0; i < input.length; i++) {
    hash += (input.charCodeAt(i) / 255);
  }

  return hash / input.length;
}

function train(data: TrainingData): any {
  console.log("Training...");

  const trainingSet = data.map(({ input, isSpam }) => ({
    input: tokenize(input),
    output: [isSpam ? 1 : 0]
  }));

  network.train(trainingSet,{
    iterations: 1500,
    log: true,
    logPeriod: 50
  });

  return network;
}

function evaluate(input: string): any {
  const result = network.run(tokenize(input));
  return result;
}

function main() {
  let isRunning = true;
  train(trainingData);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  while (isRunning) {
    rl.question("Enter a message: ", (input) => {
      if (input === "exit") {
        isRunning = false;
        rl.close();
      } else if ("train") {
        train(trainingData);
      } else {
        const result = evaluate(input);
        console.log(result);
      }
    });
  }
}

main();