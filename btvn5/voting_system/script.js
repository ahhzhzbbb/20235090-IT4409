var poll = new Map();

function addOption(option) {
  if (!option || option.trim() === "") {
    return "Option cannot be empty.";
  }

  if (poll.has(option)) {
    return `Option "${option}" already exists.`;
  }

  poll.set(option, new Set());
  return `Option "${option}" added to the poll.`;
}

function vote(option, voterId) {
  if (!poll.has(option)) {
    return `Option "${option}" does not exist.`;
  }

  const voters = poll.get(option);

  if (voters.has(voterId)) {
    return `Voter ${voterId} has already voted for "${option}".`;
  }

  voters.add(voterId);
  return `Voter ${voterId} voted for "${option}".`;
}

function displayResults() {
  let results = "Poll Results:\n"; 

  for (const [option, voters] of poll.entries()) {
    results += `${option}: ${voters.size} votes\n`;
  }

  return results.trimEnd();
}

// Test cases as per requirements
// Test 8: addOption("Egypt") should return Option "Egypt" added to the poll.
console.log(addOption("Egypt")); // Option "Egypt" added to the poll.

// Test 9: Adding an empty option should return "Option cannot be empty."
console.log(addOption("")); // Option cannot be empty.

// Test 10: When Turkey is already added, addOption("Turkey") should return Option "Turkey" already exists.
console.log(addOption("Turkey")); // Option "Turkey" added to the poll.
console.log(addOption("Turkey")); // Option "Turkey" already exists.

// Test 11: When Malaysia exists in the voting options, vote("Malaysia", "traveler1") should return Voter traveler1 voted for "Malaysia".
addOption("Malaysia");
console.log(vote("Malaysia", "traveler1")); // Voter traveler1 voted for "Malaysia".

// Test 13: When traveler1 tries to vote for Algeria again, vote("Algeria", "traveler1") should return Voter traveler1 has already voted for "Algeria".
addOption("Algeria");
console.log(vote("Algeria", "traveler1")); // Voter traveler1 voted for "Algeria".
console.log(vote("Algeria", "traveler1")); // Voter traveler1 has already voted for "Algeria".

// Test 15: When Nigeria is not in the voting options, vote("Nigeria", "traveler2") should return Option "Nigeria" does not exist.
console.log(vote("Nigeria", "traveler2")); // Option "Nigeria" does not exist.

// Test 16: A unique option should be able to receive multiple votes.
addOption("Morocco");
addOption("Spain");
vote("Morocco", 101);
vote("Morocco", 102);
vote("Spain", 201);
