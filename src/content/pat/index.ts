import type { DeckData } from '../types';
import home from './home';
import deck1 from './deck1';
import deck2 from './deck2';
import deck3 from './deck3';
import deck4 from './deck4';
import deck5 from './deck5';
import deck6 from './deck6';
import { papers } from './papers';

export type { PatDeck, PatPaper, PatTag, PatQuestion } from './types';
export { papers };

export const patHome: DeckData = home;
/** 三讲课件 + 讲义第四至六章 */
export const patDecks: DeckData[] = [deck1, deck2, deck3, deck4, deck5, deck6];
