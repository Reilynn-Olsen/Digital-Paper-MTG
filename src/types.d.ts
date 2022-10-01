type MDFCCard = {
  MDFC: true;
  name: { front: string; back: string };
  image: { front: string; back: string };
  lineType: { front: string; back: string };
};
type signleFacedCard = {
  MDFC: false;
  name: string;
  image: string;
  lineType: string;
};
type cardObj = MDFCCard | signleFacedCard;
type deck = {
  commander: [cardObj] | [cardObj, cardObj],
  deck: cardObj[],
}