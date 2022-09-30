import React, { useState } from 'react';

function GetDeck() {
  const [deckList, setDeckList] = useState<string>('')

  const deck = 
  `1 A Little Chat
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
  1 Xander's Lounge`

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()
    const deckListArray = deckList.split('\n')
    if (deckListArray.length > 0){
      const resArray = await Promise.all(deckListArray.map(card => fetch(`https://api.scryfall.com/cards/named?exact=${card.trim()}`), {
        
      }))
      console.log(resArray.map(obj => !obj.ok ? console.log(obj) : null))
    } else {
      alert('Decklist field Empty')
    }
    
  }
  return (
    <div>
      <h2>Enter your decklist below:</h2>
      <p>Please enter your deck in moxfield format (no sideboard)</p>
      <form>
        <label>Deck:</label><br/>
        <textarea onChange={(e) => setDeckList(e.target.value)} value={deckList}></textarea>
        <button type="submit" onClick={handleSubmit}>Submit deck!</button>
      </form>
    </div>
  );
}

export default GetDeck;
