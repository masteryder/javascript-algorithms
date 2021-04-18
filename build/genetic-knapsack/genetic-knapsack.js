"use strict";
// From Grokking Artifical Intelligence Algorithms
// Genetic Algorithm Lifecycle :
// 1. Encode solution space
// 2. Set algorithm parameters
// 3. Create initial population
// 4. Measure fitness of individuals
// 5. Select parents
// 6. Reproduce offspring
// 7. Populate next generation
// 8. Measure fitness of individuals
// 9. If we're happy with fitness, end here, otherwise jump to 5.
var KNAPSACK_CAPACITY = 100; // Capacity in weight of the knapsack
var OVERLOAD_FITNESS = 1; // Fitness of solution that overloads the Knapsack
var KNAPSACK_OBJECTS = [
    {
        name: "Axe",
        weight: 10,
        value: 5
    },
    {
        name: "Bronze Coin",
        weight: 1,
        value: 2
    }, {
        name: "Crown",
        weight: 3,
        value: 10
    }, {
        name: "Diamond Statue",
        weight: 25,
        value: 100
    }, {
        name: "Emerald Belt",
        weight: 20,
        value: 50
    }, {
        name: "Fossil",
        weight: 10,
        value: 1
    }, {
        name: "Gold Coin",
        weight: 1,
        value: 5
    }, {
        name: "Helmet",
        weight: 7,
        value: 1
    }, {
        name: "Ink",
        weight: 1,
        value: 1
    }, {
        name: "Jewel Box",
        weight: 5,
        value: 10
    }, {
        name: "Knife",
        weight: 2,
        value: 2
    }, {
        name: "Long Sword",
        weight: 20,
        value: 5
    }, {
        name: "Mask",
        weight: 1,
        value: 1
    }, {
        name: "Necklace",
        weight: 1,
        value: 3
    }, {
        name: "Opal Badge",
        weight: 3,
        value: 15
    }, {
        name: "Pearls",
        weight: 1,
        value: 10
    }, {
        name: "Quiver",
        weight: 3,
        value: 1
    }, {
        name: "Ruby Ring",
        weight: 1,
        value: 8
    }, {
        name: "Silver Bracelet",
        weight: 1,
        value: 5
    }, {
        name: "Timepiece",
        weight: 3,
        value: 10
    }, {
        name: "Uniform",
        weight: 4,
        value: 3
    }, {
        name: "Venom Potion",
        weight: 5,
        value: 2
    }, {
        name: "Wool Scarf",
        weight: 4,
        value: 2
    }, {
        name: "Crossbow",
        weight: 10,
        value: 4
    }, {
        name: "Yesteryear Book",
        weight: 1,
        value: 1
    }, {
        name: "Zink Cup",
        weight: 3,
        value: 1
    }
];
var NUMBER_OF_GENERATIONS = 100; // Number of generations to run the simulation on
var NUMBER_OF_SUCCESSFUL_PARENTS = 4; // Number of total parents each generation (must be pair)
var POPULATION_SIZE = 16; // How many solutions are "alive" at each time
var MUTATION_CHANCE = 0.5; // When a child is born what are the chances that a random gene is mutated
var COMPLETE_MUTATION_CHANCE = 0.05; // When a child is born what are the chances that all its genes are flipped
// const example_solution: boolean[] = [
//                           true, true, false, true, false,
//                           true, false, false, true, false,
//                           true, false, true, false, false,
//                           true, true, true, true, false,
//                           true, false, false, true, true,
//                           false
//                         ];
var population = generateInitialPopulation(POPULATION_SIZE, KNAPSACK_OBJECTS.length);
console.log("--------------------");
console.log("GEN 0");
console.log("--------------------");
var fitnessArray = computeFitnessOfPopulation(population);
var totalPopulationFitness = getTotalFitnessOfPopulation(fitnessArray);
console.log("Current fitness of population for GENERATION 0 ");
console.log(fitnessArray);
console.log("Total fitness of population for GENERATION 0 ");
console.log(totalPopulationFitness);
console.log("Best solution of generation 0 ");
var fittestIndividual = population[getFittestIndividual(population)];
console.log(translateIndividualToText(fittestIndividual));
console.log("--Total Value: ");
console.log(computeFitness(fittestIndividual));
console.log("--Total Weight: ");
console.log(getTotalWeight(fittestIndividual) + " / " + KNAPSACK_CAPACITY + " kg");
for (var g = 0; g < NUMBER_OF_GENERATIONS; g++) {
    console.log("\n\r--------------------");
    console.log("GEN " + (g + 1));
    console.log("--------------------");
    var parent_selection = rouletteWheelSelection(population, NUMBER_OF_SUCCESSFUL_PARENTS);
    var offspring = [];
    for (var i = 0; i < parent_selection.length - 1; i += 2) {
        var parent1 = parent_selection[i];
        var parent2 = parent_selection[i + 1];
        var generatedOffspring = generateOffspringRandom(parent1, parent2);
        offspring = offspring.concat(generatedOffspring);
    }
    // Populate the next generation
    var surviving_individuals = rouletteWheelSelection(population, POPULATION_SIZE - offspring.length);
    var newPopulation = [];
    for (var i = 0; i < surviving_individuals.length; i++) {
        newPopulation.push(population[surviving_individuals[i]]);
    }
    newPopulation = newPopulation.concat(offspring);
    population = newPopulation;
    fitnessArray = computeFitnessOfPopulation(population);
    totalPopulationFitness = getTotalFitnessOfPopulation(fitnessArray);
    console.log("Current fitness of population for GENERATION " + (g + 1) + ": ");
    console.log(fitnessArray);
    console.log("Total fitness of population for GENERATION " + (g + 1) + ": ");
    console.log(totalPopulationFitness);
    console.log("Best solution of generation " + (g + 1) + ": ");
    var fittestIndividual_1 = population[getFittestIndividual(population)];
    console.log(translateIndividualToText(fittestIndividual_1));
    console.log("--Total Value: ");
    console.log(computeFitness(fittestIndividual_1));
    console.log("--Total Weight: ");
    console.log(getTotalWeight(fittestIndividual_1) + " / " + KNAPSACK_CAPACITY + " kg");
}
function getTotalWeight(individual) {
    var total_weight = 0;
    for (var i = 0; i < individual.length; i++) {
        if (individual[i] === true) {
            total_weight += KNAPSACK_OBJECTS[i].weight;
        }
    }
    return total_weight;
}
function translateIndividualToText(individual) {
    var res = "";
    for (var i = 0; i < individual.length; i++) {
        if (individual[i] === true) {
            res += KNAPSACK_OBJECTS[i].name + ", CHF " + KNAPSACK_OBJECTS[i].value + ", " + KNAPSACK_OBJECTS[i].weight + "kg.";
        }
    }
    return res;
}
function getFittestIndividual(population) {
    var curMax = 0;
    var curMaxIndex = -1;
    for (var i = 0; i < population.length; i++) {
        var curFitness = computeFitness(population[i]);
        if (curFitness > curMax) {
            curMax = curFitness;
            curMaxIndex = i;
        }
    }
    return curMaxIndex;
}
function computeFitnessOfPopulation(population) {
    var fitnessArray = [];
    for (var i = 0; i < population.length; i++) {
        var curFitness = computeFitness(population[i]);
        fitnessArray.push(curFitness);
    }
    return fitnessArray;
}
function getTotalFitnessOfPopulation(fitnessArray) {
    var totalPopulationFitness = 0;
    for (var i = 0; i < fitnessArray.length; i++) {
        totalPopulationFitness += fitnessArray[i];
    }
    return totalPopulationFitness;
}
// Mutates one random gene
function mutateRandomGene(individual) {
    var geneCount = individual.length;
    var randomGene = Math.floor(Math.random() * geneCount);
    individual[randomGene] = !individual[randomGene];
}
// Mutates every gene (used when diversity needs to be introduced constantly)
function flipBitMutate(individual) {
    for (var i = 0; i < individual.length; i++) {
        individual[i] = !individual[i];
    }
}
// Uniform crossover
function generateOffspringRandom(parent_a, parent_b) {
    var children = [];
    var child1 = [];
    var child2 = [];
    for (var i = 0; i < KNAPSACK_OBJECTS.length; i++) {
        var rand = Math.random();
        if (rand > 0.5) {
            child1.push(population[parent_a][i]);
            child2.push(population[parent_b][i]);
        }
        else {
            child1.push(population[parent_b][i]);
            child2.push(population[parent_a][i]);
        }
    }
    children.push(child1, child2);
    for (var i = 0; i < children.length; i++) {
        var chancesMutation = Math.random();
        if (chancesMutation < COMPLETE_MUTATION_CHANCE) {
            flipBitMutate(children[i]);
        }
        else if (chancesMutation < MUTATION_CHANCE) {
            mutateRandomGene(children[i]);
        }
    }
    return children;
}
// Double point crossover
function generateOffspringTwoPoint(parent_a, parent_b, cross_over_point_1, cross_over_point_2) {
    var children = [];
    var child1 = [];
    var child2 = [];
    for (var i = 0; i < cross_over_point_1; i++) {
        child1.push(population[parent_a][i]);
        child2.push(population[parent_b][i]);
    }
    for (var i = cross_over_point_1; i < cross_over_point_2; i++) {
        child1.push(population[parent_b][i]);
        child2.push(population[parent_a][i]);
    }
    for (var i = cross_over_point_2; i < population[parent_a].length; i++) {
        child1.push(population[parent_a][i]);
        child2.push(population[parent_b][i]);
    }
    children.push(child1, child2);
    return children;
}
// Single point crossover
function generateOffspringSinglePoint(parent_a, parent_b, cross_over_point) {
    var children = [];
    var child1 = [];
    var child2 = [];
    for (var i = 0; i < cross_over_point; i++) {
        child1.push(population[parent_a][i]);
        child2.push(population[parent_b][i]);
    }
    for (var i = cross_over_point; i < population[parent_b].length; i++) {
        child1.push(population[parent_b][i]);
        child2.push(population[parent_a][i]);
    }
    children.push(child1, child2);
    return children;
}
// Set probabilities of population repdroduction
function setProbabilites(population) {
    var probabilityArray = [];
    for (var i = 0; i < population.length; i++) {
        probabilityArray.push(fitnessArray[i] / totalPopulationFitness);
    }
    return probabilityArray;
}
// Select parents at random by giving each a probability proportional to their fitness
function rouletteWheelSelection(population, numberOfSelections) {
    var probabilityArray = setProbabilites(population);
    // console.log("Probability array: ");
    // console.log(probabilityArray);
    var slices = [];
    var total = 0;
    for (var i = 0; i < population.length; i++) {
        slices.push([i, total, total + probabilityArray[i]]);
        total += probabilityArray[i];
    }
    var result = new Set();
    for (var i = 0; i < numberOfSelections; i++) {
        var spin = Math.random();
        for (var j = 0; j < slices.length; j++) {
            if (slices[j][1] < spin && slices[j][2] > spin) {
                if (!result.has(slices[j][0]))
                    result.add(slices[j][0]);
                else
                    i--;
            }
        }
    }
    // console.log(result);
    return Array.from(result);
}
// Creating a population of solutions
function generateInitialPopulation(population_size, individual_size) {
    var population = [];
    for (var i = 0; i < population_size; i++) {
        var currentIndividual = generateRandomSolution(individual_size);
        population.push(currentIndividual);
    }
    return population;
}
// Generate random solution
function generateRandomSolution(individual_size) {
    var curSolution = [];
    for (var i = 0; i < individual_size; i++) {
        var take_it = Math.random() > 0.5 ? true : false;
        curSolution.push(take_it);
    }
    return curSolution;
}
// Fitness is equal to the total value of the items
// (or equal to OVERLOAD_FITNESS if weight is exceeded)
function computeFitness(individual) {
    var curTotalWeight = 0;
    var curFitness = 0;
    for (var i = 0; i < individual.length; i++) {
        if (individual[i] === true) {
            curTotalWeight += KNAPSACK_OBJECTS[i].weight;
            curFitness += KNAPSACK_OBJECTS[i].value;
        }
        if (curTotalWeight > KNAPSACK_CAPACITY)
            return OVERLOAD_FITNESS;
    }
    return curFitness;
}
