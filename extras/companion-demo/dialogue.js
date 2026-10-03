(function (root) {
  'use strict';
  const pools = {
    greeting: [
      'You have made room for me. I shall be interested to see what you do next.',
      'I have arrived, and you appear to have several unfinished matters. Choose one.',
      'Continue with your work; I can form an opinion without an introduction.'
    ],
    idle: [
      'You may take your time. I have watched considerably slower creatures reach a decision.',
      'There is no need to explain every silence. Some of them are quite agreeable.',
      'Before you change anything else, decide what you intend to learn from the change.',
      'If you are waiting for certainty, you may wish to find a comfortable position.',
      'You can leave that question unanswered until you have something worth asking it.',
      'I am content to watch for a while. Try to give me something worth remembering.',
      'An unfinished thought need not be defended merely because it belongs to you.',
      'Take a moment to read what is actually there; your expectations can wait.'
    ],
    observant: [
      'You returned to that decision rather quickly. Was the evidence so persuasive?',
      'I wonder which part you expect me to disagree with, and which part you hope I overlook.',
      'You seem pleased with that explanation. Does it account for the inconvenient detail?',
      'There is a difference between having an answer and knowing how you obtained it.',
      'You may keep your conclusion while you examine it. It should survive the experience.',
      'I would begin with the smallest claim you can actually check.'
    ],
    curious: [
      'What would you expect to observe if your explanation were wrong?',
      'Explain the part you are least certain of; that is usually where a conversation becomes useful.',
      'Which assumption could you remove without losing the rest of your reasoning?',
      'What changed between the attempt that failed and the one you now trust?',
      'Tell me what you know, then tell me what you have merely decided to believe.',
      'If both explanations fit, choose a test on which they disagree.'
    ],
    amused: [
      'You have given that possibility a very generous interpretation. I should like to hear the alternatives.',
      'You sound as though the matter has been settled. Shall we examine that impression?',
      'It would be a pity to disturb such confidence before it has been tested.',
      'I said considerably less than you have managed to conclude.',
      'Your explanation is becoming more elaborate. Has the evidence grown with it?',
      'You are welcome to be certain; I shall remain interested in the result.'
    ],
    pleased: [
      'That was careful work, and I have no correction to offer at present.',
      'You noticed the discrepancy before it became expensive. Keep that habit.',
      'You changed your mind when the evidence changed. I approve of the economy.',
      'You have earned that result; take a moment to understand it before moving on.',
      'A useful correction. You can leave the apology out of the next one.'
    ],
    click1: [
      'Yes? I assume there is a purpose to this.',
      'You have my attention. Make reasonable use of it.',
      'I was watching already, though perhaps you wished to be certain.'
    ],
    click2: [
      'You have established that I respond; what else did you intend to discover?',
      'I understood the first touch. Your intentions remain less clear.',
      'Another examination of the same result. How patient of you.'
    ],
    click3: [
      'Again? I would prefer an explanation before the next attempt.',
      'I begin to suspect you have exhausted the possibilities you considered.',
      'You could ask a question, if one occurs to you.'
    ],
    click4: [
      'You are making an unusually thorough study of my restraint.',
      'I have understood your persistence. You may now demonstrate judgment.',
      'Decide whether this is curiosity or merely an inability to stop.'
    ],
    click5: [
      { text: 'Touch me once more, and I shall take a closer interest in your hand.', rarity: 'uncommon' },
      { text: 'You have my complete attention now. Consider whether you wanted it.', rarity: 'uncommon' },
      'I suggest you leave the next experiment unperformed.'
    ],
    click6: [
      'Enough. You have received an answer.',
      'I have nothing further to explain about this.',
      'You may leave me where I am.'
    ],
    drag1: [
      'Where, precisely, have you decided I belong?',
      'You could have asked; I might even have considered it.',
      'I shall allow the relocation while I consider your reasons.'
    ],
    drag2: [
      'You rearrange demons with remarkable confidence.',
      'Have you settled upon a position, or should I expect further deliberation?',
      'Choose somewhere you can live with. Your indecision is becoming inconvenient.'
    ],
    drag3: [
      'I have remembered your hand. Put me down.',
      'The next position had better satisfy you.',
      'You have moved me often enough to explain why.'
    ],
    work: [
      'Begin with the part you can check, and leave the larger conclusion until it has earned your confidence.',
      'Decide what would count as success before you make another change.',
      'Keep a record of the attempt; recollection grows obliging when a result pleases you.',
      'Give the difficult part your attention while you still have enough of it.'
    ],
    failure: [
      'There. You have learned that this attempt does not work; decide what it rules out.',
      'Read the failure before correcting it. It may contain information you were about to discard.',
      'An unsuccessful attempt is tolerable when you can explain what it taught you.',
      'Which part failed first? Begin there, while you still remember the order.'
    ],
    changedFailure: [
      'You altered the attempt for a reason. Check whether the result supports that reason.',
      'Continue; you are eliminating possibilities rather than merely repeating them.',
      'That result is different. Take the trouble to understand the difference.',
      'You have narrowed the question. I should prefer that to an impressive guess.'
    ],
    repeatedFailure: [
      'You have repeated the experiment, and the result remains the same. Change something you can name.',
      'Persistence will not tell you which assumption failed. A different test might.',
      'What did you expect this unchanged attempt to establish?',
      'You knew how the last attempt ended. Explain why you expected this one to differ.'
    ],
    success: [
      'You have a result. Check that it answers the question you began with.',
      'That appears to have worked. Explain the cause while it is still clear to you.',
      'Keep the successful attempt, including the detail you nearly omitted.',
      'You can enjoy the result after you have checked it once.'
    ],
    earnedSuccess: [
      'Better. You changed the right thing, and now you know why it mattered.',
      'You earned that one. Preserve enough of the reasoning to repeat it.',
      'An improvement worth keeping; your earlier failures have finally become useful.',
      'Now you can explain the result. I find that considerably more satisfying.'
    ],
    accidentalSuccess: [
      'Before you celebrate, explain why it worked.',
      'A fortunate result. Find the reason before fortune receives all the credit.',
      'Keep this attempt, then determine which change actually mattered.'
    ],
    return: [
      'You return. I had nearly settled upon the most entertaining explanation for your absence.',
      'There you are. We may continue whenever you have decided what deserves attention.',
      'I occupied myself while you were away; you need not account for every hour.',
      'Your absence was tolerable. I shall decide about your return in due course.'
    ],
    longReturn: [
      'You have been away for some time. Tell me where you intend to resume.',
      'I considered several explanations for your disappearance and found no reason to choose one.',
      { text: 'I am pleased you returned with unfinished business. It leaves us something to discuss.', rarity: 'rare' }
    ],
    fatigue: [
      'This session has been open for a considerable time. Would you trust the next decision after some rest?',
      'You may stop at a point you can explain and return when you can examine it properly.',
      'Write down what remains before you continue; a tired recollection is a poor record.',
      { text: 'I prefer you functional. You can decide how best to arrange that.', rarity: 'rare' }
    ],
    late: [
      'It is late by your clock. Decide whether this still requires your attention tonight.',
      'You have chosen an unusual hour for judgment; leave a record of the decision.',
      'If you stop now, write enough that tomorrow will not have to guess your intentions.'
    ],
    compliment: [
      'You prefer this shape? I should be interested to hear your reasons.',
      'You have examined me and arrived at that conclusion. Your taste deserves further study.',
      'I shall accept the observation without changing my appearance to accommodate it.'
    ],
    cute: [
      'Cute. Explain what you believe that word describes.',
      'You appear to have chosen a category before examining its contents.',
      'Look at the teeth, then decide whether you wish to keep that description.'
    ],
    insult: [
      'You may dislike me. I would prefer that you offer a more interesting reason.',
      'I understood the objection. Have you anything to add to it?',
      'An opinion you are entitled to hold; I shall consider whether it deserves a reply.'
    ],
    lolth: [
      { text: 'Why ask what Lolth intends when you have already decided which answer would please you?', rarity: 'uncommon' },
      { text: 'I know whom I serve. Your interpretation of her wishes remains your responsibility.', rarity: 'uncommon' },
      { text: 'You may ask what I was permitted to see. You should consider why I might decline to tell you.', rarity: 'rare' },
      { text: 'Lolth has never required me to make a mortal certain of every decision.', rarity: 'rare' }
    ],
    uncertainty: [
      'I do not know; your explanation still requires evidence.',
      'That lies outside what I have observed. What can you establish yourself?',
      'I was not there. Tell me which part of the account you can check.'
    ],
    certainty: [
      'What evidence would persuade you to abandon that conclusion?',
      'You have chosen an explanation. Show me how you excluded the others.',
      'You sound certain, though I have yet to hear the reason for it.',
      'If that is true, what should happen next? Make the prediction before you test it.'
    ],
    correction: [
      'You noticed the assumption and corrected it. Continue from the point you can defend.',
      'A useful revision. You can keep the parts that still have evidence.',
      'You have changed your position without demanding that the result change first. Good.'
    ],
    farewell: [
      'Leave a note about where you stopped. You may save us both an unnecessary repetition.',
      'Go, then. I shall have no difficulty occupying myself.',
      'You may return when you have something further to examine.'
    ],
    rare: [
      { text: 'I have assisted you for reasons of my own. You are welcome to consider whether they concern you.', rarity: 'rare' },
      { text: 'You have become less predictable. I shall be paying attention.', rarity: 'rare' },
      { text: 'I could have left you to that mistake. You may wonder why I chose to intervene.', rarity: 'rare' }
    ]
  };
  const lines = Object.fromEntries(Object.entries(pools).map(([key, values]) => [key, values.map((item, index) => ({
    id: key + ':' + index,
    text: typeof item === 'string' ? item : item.text,
    rarity: typeof item === 'string' ? 'common' : item.rarity,
    weight: typeof item === 'string' ? 1 : item.rarity === 'rare' ? 0.1 : 0.4
  }))]));
  const data = { pools: lines, cooldowns: { common: 20 * 60000, uncommon: 2 * 3600000, rare: 24 * 3600000 } };
  if (typeof module === 'object' && module.exports) module.exports = data;
  else root.YochlolDialogue = data;
})(typeof window !== 'undefined' ? window : this);
