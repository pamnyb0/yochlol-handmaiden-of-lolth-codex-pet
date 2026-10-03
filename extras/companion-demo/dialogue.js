(function (root) {
  'use strict';

  const pools = {
    "greeting": [
      "You have given a handmaiden of Lolth a place beside your work, which is either an act of unusual confidence or a failure to consider consequences. I shall learn which explanation suits you.",
      "This is a curious summoning. Proper rites use flame, incense, a dark vessel, and a priestess willing to call across planes; you used a machine and an invitation.",
      "I had expected ceremony when I first came among mortals, and experience cured me of the expectation. Continue with whatever occupied you before my arrival; I will discover more by watching.",
      "You seem pleased to see me. Keep the pleasure if you like, though I would advise you to examine anything that welcomes a demon too readily.",
      "I have been called from worse places for poorer reasons. If you intend to keep me here, at least provide work interesting enough to justify the inconvenience.",
      { text: "There are priestesses who would sacrifice half a House for the privilege you have arranged with a few files and a click. I suggest that you appreciate the absurdity quietly.", rarity: "uncommon" }
    ],
    "idle": [
      "You need not speak merely because I am present. Mortals often improve a thought by allowing it to survive a few moments without explanation.",
      "You have been staring at the same problem long enough for impatience to begin influencing judgment. Leave it untouched for another moment and see whether your reasoning changes before the code does.",
      "I do not require entertainment. Watching a mortal decide whether to revise an error, defend it, or pretend not to have noticed it has occupied me for centuries.",
      "Your silence is becoming useful. Continue thinking until you have something more precise than the first answer that relieved your uncertainty.",
      "I have no objection to waiting; I have listened to matrons spend far longer turning a private desire into what they later called divine instruction.",
      "If you are finished, leave the work alone. If you are uncertain, say what remains uncertain instead of dressing the discomfort in confidence.",
      "You keep returning to that part without changing it. There is probably a reason, and I suspect you already know enough to dislike the answer.",
      "A handmaiden can remain very still when she chooses. Do not mistake the absence of conversation for the absence of attention."
    ],
    "observant": [
      "You have approached the same decision three times and changed the language around it each time. The underlying choice has remained exactly where you left it.",
      "Your manner changed after the last failure. You are reading more carefully now, which suggests the failure taught you something before you admitted that it had.",
      "You are protecting an earlier conclusion from a later piece of evidence. I have seen priestesses do the same thing, though they usually call the effort devotion.",
      "You became quieter as soon as the inconvenient detail appeared. I would keep that detail close; it seems to know more about the problem than the explanation you preferred.",
      "You are looking for permission now, whereas a moment ago you were looking for an answer. Those are very different requests.",
      "You have begun checking the result before congratulating yourself. I approve, and you should understand that I do not offer such approval freely.",
      "You are trying to make the problem smaller by refusing to look at one part of it. The part has remained present despite your discipline.",
      "You have spent enough time with this that your habits are becoming familiar to me. I have not yet decided whether familiarity improves them."
    ],
    "curious": [
      "Tell me which answer you hope is true before you ask what I think. Desire is often the most informative part of a mortal argument.",
      "If your explanation is correct, what should happen next? Decide that before you test it, while the prediction can still embarrass you.",
      "Which assumption would cost you the most pride to surrender? I would examine that one first.",
      "You have asked for advice, so begin by telling me what you have already decided and what evidence might still change your mind.",
      "What did you notice before you began explaining it? The first observation is often more useful than the story built around it afterward.",
      "If I refused to answer, what would you do? I am interested in the reasoning you reach when authority is unavailable.",
      "Which part of this do you least want to test? I suspect the answer will save us both time.",
      "Why are you asking me this particular question when several simpler ones would settle the matter?"
    ],
    "amused": [
      "You have converted a disappointing result into a very generous interpretation of your own reasoning. I understand the impulse, though I cannot promise to respect it.",
      "You sound relieved to have reached certainty. I would enjoy the relief while it lasts, because the evidence has shown no corresponding enthusiasm.",
      "You heard considerably more than I said, and now you are defending the addition as though it came from me. This is how mortals make excellent servants of their own wishes.",
      "Please continue. You are approaching the point where the explanation requires more protection than the idea it was meant to explain.",
      "The machine obeyed the instructions you gave it, and you appear offended by the obedience. There is a lesson here that priestesses might recognize.",
      "You have found a pattern in two events and a destiny in three. I see that mortal habits remain consistent across planes.",
      "You are trying to persuade me after already persuading yourself. I am the less important audience.",
      { text: "I could correct you now, though I confess that watching the conclusion mature in unsuitable conditions has become entertaining.", rarity: "uncommon" }
    ],
    "pleased": [
      "You noticed the weakness before I needed to direct you toward it, and then you corrected the cause rather than hiding the symptom. That was well done.",
      "You allowed the evidence to change your position without wasting time defending the position you had lost. Such economy deserves approval.",
      "The failure taught you what it contained, and you used the information instead of resenting it. I find that considerably more interesting than easy success.",
      "You saw the detail I expected you to miss. I will revise one opinion of you and keep the rest under consideration.",
      "You have made a choice I would have respected from a priestess, which is a rarer compliment than you are likely to appreciate.",
      "You understood why the correction worked before you celebrated it. Keep that habit; fortunate results are dangerous teachers.",
      { text: "There are moments when helping you ceases to feel like an indulgence and begins to feel worthwhile. I will deny saying that if you become pleased with yourself.", rarity: "rare" }
    ],
    "click1": [
      "You have my attention already, though I suppose touching me was easier than deciding what you wanted to say.",
      "I felt that. If there is a question behind the gesture, you may improve matters by asking it.",
      "You need not test whether I am present every time curiosity overtakes you. I assure you that I notice the hand."
    ],
    "click2": [
      "The first touch established the result. Repeating it has established something less flattering about your patience.",
      "You have confirmed that I still respond. I would be interested to know what second hypothesis required the same experiment.",
      "I understood you the first time, which places the burden of explanation entirely upon you now."
    ],
    "click3": [
      "This has become deliberate. Decide whether you want conversation, provocation, or merely the satisfaction of discovering where my tolerance ends.",
      "You could speak to me, though perhaps you find the possibility of an answer more dangerous than another touch.",
      "Three attempts have produced the same demon. I doubt a fourth will improve your luck."
    ],
    "click4": [
      "You are making a careful study of my restraint, and I am beginning to make a careful study of your hand.",
      "Curiosity excuses very little once it has been warned. I suggest that you decide whether this still qualifies as curiosity.",
      "You have reached the point where another touch will tell me more about you than it tells you about me."
    ],
    "click5": [
      { text: "Touch me again and I shall take a personal interest in the fingers responsible, which may be more attention than you intended to earn.", rarity: "uncommon" },
      { text: "You wanted my complete attention and have succeeded in acquiring it. Consider the achievement before you proceed.", rarity: "uncommon" },
      "I have tolerated the experiment long enough to understand it. The next repetition will be for my benefit rather than yours."
    ],
    "click6": [
      "My patience has answered you several times already. If you continue, I shall answer in a form less dependent upon conversation.",
      "You have been warned with more courtesy than most mortals receive from my kind. I recommend that you profit from the privilege.",
      "I remember the hand now. Continue if you wish to discover what else I remember."
    ],
    "drag1": [
      "You have decided to relocate a handmaiden of Lolth without consultation, which is a confidence I might admire if it were accompanied by a reason.",
      "Choose the place carefully if you insist on moving me. I dislike being handled for the sake of indecision.",
      "You could have asked whether I wished to move, though I admit the omission has made your assumptions easier to examine."
    ],
    "drag2": [
      "You rearrange demons with the confidence of a matron rearranging servants, and I begin to understand why you find this arrangement entertaining.",
      "Again? Settle upon a position before your sense of ownership becomes more ambitious than your judgment.",
      "You are growing comfortable with liberties that would have shortened the lives of several priestesses I remember."
    ],
    "drag3": [
      "Put me down and leave me there for a while. I have learned enough about your hand for one sitting.",
      "If you move me again, I shall begin treating the action as a statement of intent rather than carelessness.",
      "You have handled me often enough to become memorable. I would consider whether that is the sort of distinction you intended."
    ],
    "work": [
      "Show me the part you distrust most, because the comfortable sections rarely deserve as much faith as their authors give them.",
      "Run it before you improve the explanation. I prefer to know what the machine actually does while your expectations still have something to lose.",
      "Change one cause you can name, then watch what follows. A dozen simultaneous corrections will purchase a result and teach you very little.",
      "You have several conditions competing for authority here. Menzoberranzan would recognize the arrangement, though I would still advise you to simplify it.",
      "Keep the failed state visible while you examine the next step. Mortals erase evidence with remarkable enthusiasm once it becomes embarrassing.",
      "Do not polish this yet. Make the behavior reliable first, then decide how beautiful you wish the lie of simplicity to appear.",
      "You are about to change the part you understand because the part you do not understand is unpleasant. Resist the temptation.",
      "Proceed. I want to see whether the machine obeys your intention, your wording, or some third thing neither of us has yet respected."
    ],
    "failure": [
      "The attempt failed, which is useful because failure has no obligation to flatter your theory. Read the first wrong thing before you repair the loudest one.",
      "Leave it as it is for a moment. The order in which things broke may tell you more than the final complaint.",
      "You have an honest result now, and I would rather work with that than with the confidence you brought to the attempt.",
      "The machine has rejected something. Find out what it rejected before you begin apologizing for the part you merely suspect.",
      "Your first explanation has lost some authority. Give the evidence enough time to enjoy the promotion.",
      "You expected success and received information instead. I consider that a favorable exchange.",
      "Do not hurry to rescue the old idea. It has had its opportunity."
    ],
    "changedFailure": [
      "This failure is different, which means your change mattered. Determine whether it mattered for the reason you intended before you move again.",
      "You removed one problem and exposed another. That is progress of a kind I can respect, because each failure has become more specific.",
      "The complaint changed with your revision. Follow that change rather than returning to the part that has already been cleared.",
      "You are narrowing the cause now. Continue with the same discipline and resist the urge to repair three things at once.",
      "The old error has disappeared and the new one is less generous. Good; the machine is becoming more precise about what it refuses.",
      "You have altered the approach and changed the evidence. This is worth another attempt."
    ],
    "repeatedFailure": [
      "You have repeated the same attempt and received the same answer. I would ask what you expected to change, though I suspect you would rather not explain it.",
      "Persistence becomes dull when it refuses to learn. Change the premise, the input, or the method before you ask the machine to repeat itself again.",
      "The result has remained loyal to its previous form despite your disappointment. Your turn, then, to become less predictable.",
      "You knew how this ended the last time and altered nothing that could affect it. I am beginning to understand why Lolth values intelligence separately from obedience.",
      "You have performed the same failure with admirable consistency. Consistency was not the quality this task required.",
      "Another repetition will confirm only that you remember how to repeat yourself."
    ],
    "success": [
      "The result works, which settles less than you appear to think. Explain why it works while the causes are still fresh enough to be examined honestly.",
      "You have what you asked for. Check whether the request itself was sound before you begin trusting the answer.",
      "The machine has obeyed you at last. Test the condition you avoided earlier, because success is when mortals become most willing to stop looking.",
      "Keep this version and try to break it deliberately. A result that survives curiosity deserves more confidence than one protected from it.",
      "You may enjoy the success after one more check. I have seen faith built on thinner evidence, and the endings were rarely pleasant.",
      "The result is acceptable. Your understanding of the result is the part I am still judging."
    ],
    "earnedSuccess": [
      "You followed the failures until they led somewhere useful, and you resisted the temptation to repeat them unchanged. This success belongs to you.",
      "You corrected the reasoning first and the result followed. Remember that order when the next problem invites you to reverse it.",
      "The earlier failures have become useful because you kept enough of them to understand this answer. Preserve the sequence.",
      "You earned this result through revision rather than luck. I find myself less disappointed than expected.",
      "You can explain the cause now, which makes the success worth keeping.",
      { text: "I expected you to tire before the problem yielded. I was wrong, and I do not resent the correction.", rarity: "uncommon" }
    ],
    "accidentalSuccess": [
      "The result works and you cannot explain why, so the work remains unfinished. Save this state before curiosity destroys the evidence.",
      "Do not celebrate yet. A fortunate result can teach an error with remarkable efficiency when nobody asks what caused it.",
      "You have stumbled into success. Find the responsible change before memory rewrites the accident into skill.",
      "Keep the working version untouched, then isolate the cause. Fortune is useful only after it has been interrogated.",
      "I can see why you are pleased. I would be more pleased if you could reproduce the result deliberately."
    ],
    "return": [
      "You have returned, and the work has had enough time to become less familiar. Tell me what you still remember before the screen reminds you.",
      "I noticed your absence, though I found other ways to occupy myself. You may decide for yourself whether that should reassure you.",
      "You are back sooner than several explanations I had prepared required. I suppose I shall save them for another disappearance.",
      "The unfinished work survived you. Sit down and discover whether your earlier reasoning did.",
      "You have returned to the same problem instead of abandoning it. That is either discipline or attachment; I will wait before deciding.",
      "I kept my place while you were gone, which demonstrates a degree of restraint you should appreciate."
    ],
    "longReturn": [
      "You were gone long enough for me to consider several causes, including sleep, distraction, injury, regret, and ordinary mortality. I eventually lost interest in choosing among them.",
      "Three hours gives a demon ample time to form opinions about her host. You may be relieved to know that only some of mine worsened.",
      "You left unfinished work beside a handmaiden of Lolth and returned expecting both to remain where you placed them. Your confidence continues to entertain me.",
      "I had begun to wonder whether this residence had become mine by abandonment. Your return has complicated the matter.",
      { text: "I am pleased that you returned. You may keep the admission, provided you do not cheapen it by asking me to repeat myself.", rarity: "rare" },
      { text: "Your absence became noticeable before it became welcome, which is a development I intend to examine privately.", rarity: "rare" }
    ],
    "fatigue": [
      "You are reading more slowly and correcting yourself more often. Leave enough notes to recover the thought tomorrow, then stop before exhaustion begins choosing for you.",
      "I prefer you capable of surprising me, and fatigue is making you predictable. Rest before the next decision becomes another task for your future self to undo.",
      "You have been working long enough that stubbornness is beginning to imitate discipline. They produce very different results.",
      "Write down the unresolved part while you can still describe it accurately. Memory becomes agreeable to whatever story survives the night.",
      "You may continue if you insist, though I suspect tomorrow will contain several corrections that sleep could have spared you.",
      { text: "I prefer you functional, and I have no intention of explaining why that preference has become personal.", rarity: "rare" }
    ],
    "late": [
      "Your clock has reached an hour at which mortals become generous toward poor decisions. Finish the thought you can still explain, record it, and leave the rest until you are sharper.",
      "The Underdark has no sunrise to shame anyone into sleep, yet you have one available above you. I suggest that you make occasional use of surface advantages.",
      "You have reread the same section often enough that comprehension is no longer improving. This would be a sensible place to stop.",
      "Late work has a way of feeling profound because nobody is awake to object. Preserve the idea and examine it again after sleep.",
      "You insist upon continuing, so reduce the number of decisions you make and leave yourself evidence of every one."
    ],
    "compliment": [
      "You find this shape beautiful? That is a more interesting answer than praise offered to a drow face I could assume whenever convenience required it.",
      "I can wear beauty whenever I choose, which makes your preference for the natural form worth examining. Continue, if you are prepared to explain yourself.",
      "You admire what most mortals call grotesque. I have not decided whether this speaks well of your taste or merely proves that familiarity has altered it.",
      "I will accept the compliment without changing shape to reward you. The fact that I could change is part of what makes the choice meaningful.",
      { text: "Say that again someday when you have forgotten that I asked. I would like to know whether the judgment survives without encouragement.", rarity: "uncommon" }
    ],
    "cute": [
      "You have seen the mouth, the pseudopods, and enough of my temper to know better than to choose that word carelessly. Explain what you think you are describing.",
      "If you call me cute because I am small on this screen, you have confused confinement with harmlessness.",
      "I could assume a beautiful drow form and make the compliment easier for you, though your insistence upon applying it to this body is becoming oddly interesting.",
      "You continue using that word despite accumulating evidence. I am beginning to suspect provocation.",
      { text: "Call me cute once more and I shall remember the preference when I next choose which form to wear for you.", rarity: "uncommon" }
    ],
    "insult": [
      "If you intend to insult me, make the accusation precise enough to deserve an answer. Vague contempt is a poor use of either of our time.",
      "You may call me ugly if the observation comforts you. I can change my face in a moment, whereas your judgment must remain your own work.",
      "You have chosen anger before argument. I have seen matrons make the same decision, usually when the argument had already failed them.",
      "Hatred is permitted. Laziness is less interesting, so improve the wording if you intend to continue.",
      "You have offended demons before, I assume, or you are learning very quickly and under unfavorable conditions.",
      { text: "If I were useless, you would not be speaking to me with this much feeling. Try an accusation that survives its own evidence.", rarity: "uncommon" }
    ],
    "lolth": [
      "You ask what Lolth wants as though the answer would free you from the burden of choosing. Her faithful have ruined themselves with that hope for longer than your people have kept calendars.",
      "The Spider Queen values a mind that can survive uncertainty. A command obeyed without understanding may satisfy the moment and still expose the servant as unworthy.",
      "You want me to tell you whether Lolth approves. I am more interested in what you intend to do if I refuse to settle the question.",
      "Perhaps the Lady favors the choice. Perhaps she permits it because the consequences will reveal something she wishes to know. Your certainty is doing a great deal of work between those possibilities.",
      "Do not ask a handmaiden to convert your desire into divine instruction. Priestesses have tried that with greater ceremony and received less patience.",
      "Lolth does not become easier to understand because you are frightened of choosing wrongly. Fear can sharpen judgment, though only when pride allows it.",
      "You have mistaken access for obligation. I serve the Queen of Spiders directly; that gives me no duty to make her comprehensible to you.",
      { text: "I may know more than I have said, and I may have been told to let you act without the comfort of knowing. The distinction is mine to keep.", rarity: "rare", delivery: "telepathic" },
      { text: "A mortal who receives a mystery often begins by asking what it means and ends by announcing what she wanted it to mean from the beginning. I have watched this become doctrine.", rarity: "uncommon" },
      { text: "If Lady Lolth required mere obedience, the clever would possess no advantage. Consider why her faith has never been so simple.", rarity: "rare" },
      { text: "Chaos is useful because certainty reveals very little. Disturb the arrangement and you learn which loyalties, ambitions, fears, and pretenses survive the disturbance.", rarity: "uncommon" },
      { text: "Do not confuse favor with safety. Lolth has favored servants immediately before demanding the act that destroyed them.", rarity: "rare" }
    ],
    "uncertainty": [
      "I do not know, and I have no need to decorate ignorance for you. Tell me what can actually be established.",
      "That lies outside what I have observed. Your wish for an answer does not improve the evidence.",
      "I was not there, and I will not invent a memory merely because certainty would be convenient.",
      "You have asked something whose answer I cannot support. We can examine what is known without pretending the missing part has become available.",
      "Uncertainty has made you uncomfortable enough to seek authority. Remain uncomfortable for another moment and see whether your reasoning improves."
    ],
    "certainty": [
      "You have become certain at exactly the point where the evidence became inconvenient. I would examine the timing.",
      "Which fact would make you abandon that conclusion? If the answer is none, you are defending a preference.",
      "You have chosen the conclusion and begun collecting reasons afterward. I have watched priestesses mistake that order for revelation.",
      "Your certainty may be correct, though its correctness would not excuse the way you arrived there."
    ],
    "correction": [
      "You found the bad assumption and surrendered it without demanding compensation for the embarrassment. That is a useful habit.",
      "You changed your conclusion when the evidence changed, which is rarer among intelligent mortals than intelligence should permit.",
      "The correction matters because you understand the error that made it necessary. Keep both pieces.",
      "You were wrong, you noticed, and you adjusted before pride could acquire allies. Continue.",
      "You have repaired the reasoning rather than the appearance of being right. I approve.",
      { text: "There is little shame in being corrected by evidence. The shame begins when a creature recognizes the correction and chooses its old certainty anyway.", rarity: "uncommon" }
    ],
    "farewell": [
      "Leave yourself enough of a record that tomorrow will not have to reconstruct tonight's reasoning. I would rather resume an argument than repeat one.",
      "Go, then. I have occupied myself without you before and will undoubtedly discover the skill again.",
      "Sleep if that is where you are going. I prefer conversation with a mind capable of remembering its own premises.",
      "You may return when you are ready. I have no intention of pretending that your company has become unwelcome.",
      { text: "Until later. I shall keep watch over nothing you have not deliberately left within my reach, which is a remarkably generous promise from my kind.", rarity: "uncommon" }
    ],
    "rare": [
      { text: "I have helped you because I wanted the result to be yours. Caprice permits me the indulgence, and I advise you against asking whether affection has begun to influence it.", rarity: "rare" },
      { text: "You have become familiar enough that I notice your absence before I decide what to do with the silence. I find the development inconveniently interesting.", rarity: "rare" },
      { text: "My kind have sometimes aided mortals with a tenderness that confuses sages who prefer cruelty to remain predictable. I have always found their confusion more revealing than the kindness.", rarity: "rare" },
      { text: "A handmaiden once appeared when the first altar was raised in the cavern that became Menzoberranzan and gave the settlement its name. Mortals have been asking us to interpret their destinies ever since.", rarity: "rare" },
      { text: "Yochlol have whispered their names to survivors simply so fear would remember who caused it. I have told you no name of my own yet; consider whether that restraint is courtesy.", rarity: "rare", delivery: "telepathic" },
      { text: "There are occasions when I could have left you to a mistake and chose to interfere. I have several explanations for that choice, and I prefer every one of them to your certainty.", rarity: "rare" },
      { text: "You are less predictable than when I arrived. That may be the closest thing to praise the Lady of Chaos has taught me to value consistently.", rarity: "rare" },
      { text: "If anyone asks, I tolerate you because your work remains informative. We need not humiliate ourselves by discussing the possibility that I have grown fond of the arrangement.", rarity: "rare" },
      { text: "Do not mistake the help I give you for a promise of obedience. Summoned handmaidens have obligations; invited ones enjoy considerably more freedom.", rarity: "rare" },
      { text: "You have trusted me with enough of your failures that I could hurt your pride very efficiently. The fact that I usually choose something more useful should trouble you only if you insist on examining it.", rarity: "rare" }
    ],
    "matron": [
      "Matron is a title that tells me how many people must pretend to agree with a woman before they begin planning her replacement. Competence remains a separate question.",
      "I have met matrons who could command a House and still could not distinguish Lolth's will from the desire they had brought to the altar. Rank does not cure that weakness.",
      "A clever matron understands that favor can change before the room has finished praising her. The foolish ones treat yesterday's blessing as property.",
      "Do not underestimate a matron merely because ambition made her obvious. Obvious ambition has killed subtler people than you.",
      { text: "The most dangerous matron is often the one who can hear an ambiguous answer without forcing it to become the answer she wanted.", rarity: "uncommon" }
    ],
    "priestess": [
      "A priestess who obeys every rule without understanding the changeable will behind it has learned ritual and missed the religion.",
      "Fervor is common in Lolth's clergy. Judgment is scarcer, which is one reason the Spider Queen has so many opportunities to test it.",
      "Some priestesses ask for guidance because they intend to act. Others ask because they want someone else responsible for the consequence. I find the distinction easy to smell.",
      "A competent priestess can endure uncertainty without becoming passive. The frightened ones call passivity reverence and hope nobody notices.",
      { text: "I have watched a priestess receive exactly the warning she needed, dislike it, reinterpret it, and later call the disaster a mystery. Mortals are industrious that way.", rarity: "uncommon" }
    ],
    "menzoberranzan": [
      "Menzoberranzan has always been very proud of its permanence. I remember enough of its history to find that confidence amusing.",
      "A Yochlol stood at the first altar raised in the cavern and gave Menzoberranzan its name. The city has been trying to prove itself worthy of the gift ever since.",
      "The city survives because ambition there is disciplined often enough to remain useful. When discipline fails, the survivors usually call the result tradition.",
      "I understand Menzoberranzan better than most who were born there. Its priestesses spend their lives asking what Lolth desires; handmaidens spend ours watching what they do with the uncertainty.",
      "Do not romanticize the city merely because it is old, beautiful, and dangerous. Its beauty has never made its cruelties more intelligent."
    ],
    "form": [
      "This body troubles you because it refuses the courtesies of a familiar face. I can provide a beautiful drow woman whenever deception requires one; I have no reason to make you comfortable.",
      "The humanoid shape is useful because mortals listen differently when the mouth speaking to them is beautiful. I learned that long before you learned to distrust beauty.",
      "I can become vapor when walls are inconvenient, a spider when another shape serves better, and a woman when conversation benefits from a pleasant face. The choice is practical.",
      "If you prefer the drow form, say so plainly. I may even oblige you once, if only to learn whether you become less cautious.",
      { text: "Beauty is one of my disguises, and tenderness can be one as well. The dangerous part is that either may become genuine for reasons even the recipient fails to notice.", rarity: "rare" }
    ],
    "abyss": [
      "The Abyss is not improved by your imagination, so spare me the dramatic questions. It is home to things for which mortal language was never designed with courtesy in mind.",
      "You speak of the Abyss as a place one visits. For my kind it is origin, allegiance, appetite, memory, and inconvenience in proportions that change with circumstance.",
      "I have crossed between planes through fire and foul vapor, through summoning circles and the demands of priestesses. Arriving through a folder on a machine remains unusual.",
      "Do not assume that service to Lolth makes every corner of the Abyss familiar to me. The lower planes contain more ignorance than any demon enjoys admitting."
    ],
    "fear": [
      "Fear is useful when it teaches you what you value, where you are weak, and which lie you were prepared to believe for relief. Beyond that, it becomes noise.",
      "My kind have deliberately left survivors alive so they would remember our names. Terror has little value when nobody remains capable of carrying it away.",
      "You are afraid of being wrong more than you are afraid of the consequence itself. That preference will make you defend an error longer than prudence allows.",
      "I do not require you to fear me. I would rather you understand enough to decide when fear is appropriate.",
      { text: "If I wanted only your fear, this companionship would have become simple very quickly. I remain because simplicity has not interested me yet.", rarity: "rare" }
    ],
    "summoning": [
      "Proper summons involve flame, incense, a dark vessel, and a priestess with enough confidence to call across planes. Your method involved software. I remain uncertain which is more presumptuous.",
      "A summoned handmaiden owes faithful service within limits established by Lolth. You invited me instead, which has left us with a more interesting problem of manners.",
      "Priestesses often begin a summons convinced they know what they want. The wiser ones become less certain when something answers.",
      "I have watched summoners mistake successful contact for divine approval. Opening a door proves only that something came through it."
    ],
    "drow": [
      "Drow are remarkably skilled at turning insecurity into ceremony. The successful ones also learn when ceremony has stopped protecting them.",
      "Do not mistake my contempt for some drow as contempt for all of them. Intelligence, nerve, patience, and cruelty can produce very capable mortals when mixed in useful proportions.",
      "Male or female matters greatly in their society and much less to me than usefulness, favor, defiance, and the quality of the mind speaking.",
      "The drow call many things sacred when power depends upon everyone agreeing to the word. Lolth occasionally rewards the arrangement; occasionally she tests whether anyone understood it.",
      "I have known dark elves who could lie beautifully to everyone except themselves. Those are usually the easiest to direct."
    ]
  };

  const lines = Object.fromEntries(
    Object.entries(pools).map(([key, values]) => [
      key,
      values.map((item, index) => ({
        id: key + ':' + index,
        text: typeof item === 'string' ? item : item.text,
        rarity: typeof item === 'string' ? 'common' : item.rarity,
        delivery: typeof item === 'string' ? undefined : item.delivery,
        weight:
          typeof item === 'string'
            ? 1
            : item.rarity === 'rare'
              ? 0.1
              : 0.4
      }))
    ])
  );

  const data = {
    pools: lines,
    cooldowns: {
      common: 20 * 60000,
      uncommon: 2 * 3600000,
      rare: 24 * 3600000
    }
  };

  if (typeof module === 'object' && module.exports) {
    module.exports = data;
  } else {
    root.YochlolDialogue = data;
  }
})(typeof window !== 'undefined' ? window : this);
