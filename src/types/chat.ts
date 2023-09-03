export interface ChatInitialRequest {
  login: string;
  topics: number;
}

export interface ChatMessageRequest {
  login: string;
  topics: number;
  message: string;
}

export interface ChatMessage {
  id: number;
  login: string;
  message: string;
}

export interface InitialChatData {
  topics: string;
  result: ChatMessage[];
}

export type ChatErrorObserver = ((errorMsg: string) => void);
export type ChatCloseObserver = (() => void);
export type ChatMessageObserver = ((chatMessage: ChatMessage) => void);

export interface ChatObserversMap {
  close: ChatCloseObserver,
  error: ChatErrorObserver,
  message: ChatMessageObserver,
}

export type ObserversEventName = keyof ChatObserversMap;

export type ChatObservers = {
  [EventName in keyof ChatObserversMap]: ChatObserversMap[EventName][];
}

export interface SocketData {
  topicId?: number;
  topicName?: string;
  login?: string;
}
