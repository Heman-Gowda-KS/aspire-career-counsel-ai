
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp?: string;
}

export interface ChatInterfaceProps {
  userType: 'student' | 'professional';
  userPath?: string;
}
