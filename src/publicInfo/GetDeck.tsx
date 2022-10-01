import React, { useState } from 'react';
type GetDeckProps = { transmitDecklist(a: deck): void };
type sortedUserDeckList = { amount: number; name: string };

type scryFallCard = {
  name: string;
  type_line: string;
  image_uris: {
    small: string;
    normal: string;
  };
};

type scryFallMDFC = {
  name: string;
  card_faces: [scryFallCard, scryFallCard];
};

type scryFallData = scryFallCard | scryFallMDFC;

const isCardObj = (value: unknown): value is cardObj =>
  typeof value === 'object' &&
  'MDFC' in value &&
  'name' in value &&
  'image' in value &&
  'lineType' in value;

const isCommanderTuple = (
  value: unknown[]
): value is [cardObj] | [cardObj, cardObj] =>
  (value.length === 2 || value.length === 1) &&
  value.every((el) => isCardObj(el));

const hasDeckProps = (
  value: unknown
): value is { commander: unknown[]; deck: unknown[] } =>
  typeof value === 'object' && 'commander' in value && 'deck' in value;

const isDeck = (value: unknown): value is deck =>
  hasDeckProps(value) &&
  isCommanderTuple(value.commander) &&
  value.deck.every((el: unknown) => isCardObj(el));

function GetDeck(Props: GetDeckProps) {
  const sampleDeck = `1 A Little Chat
  1 Alchemist's Gambit
  1 Arcane Signet
  1 Archmage Emeritus
  1 Bedevil
  1 Big Score
  1 Bojuka Bog
  1 Command Tower
  1 Cormela, Glamour Thief
  1 Counterspell
  1 Deadly Dispute
  1 Demonic Gifts
  1 Doom Blade
  1 Double Vision
  1 Expressive Iteration
  1 Feed the Swarm
  1 Goblin Electromancer
  1 Infernal Grasp
  6 Island
  1 Jwari Disruption
  1 Karn's Temporal Sundering
  1 Leyline of Anticipation
  1 Maestros Ascendancy
  1 Maestros Charm
  1 Maestros Theater
  1 Metallurgic Summonings
  4 Mountain
  1 Opt
  1 Ponder
  1 Prismari Campus
  1 Professor Onyx
  1 Resculpt
  1 Rewind
  1 Silundi Vision
  1 Sokenzan, Crucible of Defiance
  1 Storm King's Thunder
  1 Storm-Kiln Artist
  4 Swamp
  1 Talrand, Sky Summoner
  1 Temple of Epiphany
  1 Thriving Bluff
  1 Thriving Isle
  1 Thriving Moor
  1 Unexpected Windfall
  1 Unsubstantiate
  1 Unwind
  1 Woe Strider
  1 Xander's Lounge`;

  const [decklist, setDecklist] = useState<string>(sampleDeck);
  const [commanders, setCommanders] = useState<[string, string]>([
    'Anhelo, The Painter',
    '',
  ]);

  const sortDeck = (cardName: string): sortedUserDeckList => {
    return {
      amount: Number(cardName.match(/[0-9\n]+/)[0]),
      name: cardName.match(/[^0-9\s][^0-9\n]+/)[0].trim(),
    };
  };

  const formatCard = (data: scryFallData): cardObj[] => {
    const sortedData: cardObj[] = [];
    if ('card_faces' in data) {
      sortedData.push({
        MDFC: true,
        image: {
          front: data.card_faces[0].image_uris.small,
          back: data.card_faces[1].image_uris.small,
        },
        name: {
          front: data.card_faces[0].name,
          back: data.card_faces[1].name,
        },
        lineType: {
          front: data.card_faces[0].type_line,
          back: data.card_faces[0].type_line,
        },
      });
    } else {
      sortedData.push({
        MDFC: false,
        image: data.image_uris.small,
        name: data.name,
        lineType: data.type_line,
      });
    }
    return sortedData;
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    const commanderReq = [];

    if (commanders[0]) {
      commanderReq.push(
        fetch(
          `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(
            commanders[0]
          )}`
        )
      );
    }
    if (commanders[1]) {
      commanderReq.push(
        fetch(
          `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(
            commanders[1]
          )}`
        )
      );
    }
    let commanderData: cardObj[] = [];
    const commanderRes = await Promise.all(commanderReq);
    for await (const commander of commanderRes) {
      const data = await commander.json();
      commanderData = commanderData.concat(formatCard(data));
    }

    const decklistArray = decklist
      .split('\n')
      .map(sortDeck)
      .filter(
        (obj) => obj.name !== commanders[0] || obj.name !== commanders[1]
      );
    if (decklistArray.length > 0) {
      try {
        const resArray = await Promise.all(
          decklistArray.map((card) =>
            fetch(
              `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(
                card.name
              )}`
            )
          )
        );
        let sortedData: cardObj[] = [];
        let amountIndex = 0;
        for await (const obj of resArray) {
          if (obj.ok) {
            const data = await obj.json();
            for (let i = 0; i < decklistArray[amountIndex].amount; i++) {
              sortedData = sortedData.concat(formatCard(data));
            }
            amountIndex++;
          } else {
            console.log(obj.status);
            console.log(obj.statusText);
          }
        }
        const deckObj = { commander: commanderData, deck: sortedData };

        if (isDeck(deckObj)) {
          Props.transmitDecklist(deckObj);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      alert('Decklist field Empty');
    }
  };
  return (
    <div>
      <h2>Enter your decklist below:</h2>
      <p>Please enter your deck in moxfield format (no sideboard)</p>
      <form>
        <label>Commander:</label>
        <br />
        <input
          type="text"
          value={commanders[0]}
          onChange={(e) => setCommanders((prev) => [e.target.value, prev[1]])}
        ></input>
        <br />
        <label>Partner:</label>
        <br />
        <input
          type="text"
          value={commanders[1]}
          onChange={(e) => setCommanders((prev) => [prev[0], e.target.value])}
        ></input>
        <br />
        <label>Deck:</label>
        <br />
        <textarea
          onChange={(e) => setDecklist(e.target.value)}
          value={decklist}
        ></textarea>
        <button type="submit" onClick={handleSubmit}>
          Submit deck!
        </button>
      </form>
    </div>
  );
}

export default GetDeck;
