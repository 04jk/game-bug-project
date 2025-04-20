
import React, { useState, useEffect, useRef } from 'react';
import { useRole } from '@/contexts/RoleContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { MessageSquare, SendHorizonal, Users, UserPlus, Copy } from 'lucide-react';
import { mockBugs } from '@/data/store/bugStore';
import { currentUser } from '@/data/generators/mockUsers';
import { UserRole } from '@/types/user';

// Mock chat data structure
type ChatMessage = {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isSystem?: boolean;
};

// Mock active rooms
const mockRooms = [
  { 
    id: "room1", 
    name: "Bug #1234 Discussion", 
    host: "user2", 
    hostName: "Sarah Tester",
    bugId: mockBugs[0]?.id, 
    participants: ["user1", "user2"]
  },
  { 
    id: "room2", 
    name: "Bug #5678 Discussion", 
    host: "user2", 
    hostName: "Sarah Tester", 
    bugId: mockBugs[1]?.id, 
    participants: ["user1", "user2", "user4"] 
  },
];

// Mock messages
const initialMessages: Record<string, ChatMessage[]> = {
  room1: [
    {
      id: "msg1",
      senderId: "user2",
      senderName: "Sarah Tester",
      content: "Hey, I found this rendering bug that happens when resizing the window. Can you reproduce it?",
      timestamp: "2024-04-18T14:30:00Z"
    },
    {
      id: "msg2",
      senderId: "user1",
      senderName: "John Developer",
      content: "Yes, I can see it. It looks like a CSS flex issue. Let me check the code.",
      timestamp: "2024-04-18T14:32:00Z"
    },
    {
      id: "msg3",
      senderId: "system",
      senderName: "System",
      content: "John Developer has shared a code snippet.",
      timestamp: "2024-04-18T14:35:00Z",
      isSystem: true
    }
  ],
  room2: [
    {
      id: "msg4",
      senderId: "user2",
      senderName: "Sarah Tester",
      content: "This bug is affecting login functionality. High priority!",
      timestamp: "2024-04-19T09:15:00Z"
    },
    {
      id: "msg5",
      senderId: "user4",
      senderName: "Emily Designer",
      content: "I'm seeing the issue too. The form doesn't validate correctly.",
      timestamp: "2024-04-19T09:17:00Z"
    }
  ]
};

const ChatRoom = () => {
  const navigate = useNavigate();
  const { userRole, isTester, isDeveloper, can } = useRole();
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState<'host' | 'join'>('join');
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [joinCode, setJoinCode] = useState("");
  const [newRoomName, setNewRoomName] = useState("");
  const [selectedBugId, setSelectedBugId] = useState("");
  const [availableBugs, setAvailableBugs] = useState(mockBugs);
  const [rooms, setRooms] = useState(mockRooms);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeRoomId, messages]);

  // Set the correct initial tab based on user role
  useEffect(() => {
    if (isTester) {
      setActiveTab('host');
    } else if (isDeveloper) {
      setActiveTab('join');
    }
  }, [isTester, isDeveloper]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeRoomId) return;

    const newMsg: ChatMessage = {
      id: `msg${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: newMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => ({
      ...prev,
      [activeRoomId]: [...(prev[activeRoomId] || []), newMsg]
    }));
    
    setNewMessage("");
  };

  const handleCreateRoom = () => {
    if (!newRoomName || !selectedBugId) {
      toast.error("Please provide a room name and select a bug");
      return;
    }

    const newRoomId = `room${Date.now()}`;
    const newRoom = {
      id: newRoomId,
      name: newRoomName,
      host: currentUser.id,
      hostName: currentUser.name,
      bugId: selectedBugId,
      participants: [currentUser.id]
    };

    // Create system message for the new room
    const systemMsg: ChatMessage = {
      id: `msg${Date.now()}`,
      senderId: "system",
      senderName: "System",
      content: `Chat room created by ${currentUser.name}. Use code ${newRoomId} to invite others.`,
      timestamp: new Date().toISOString(),
      isSystem: true
    };

    setRooms(prev => [...prev, newRoom]);
    setMessages(prev => ({
      ...prev,
      [newRoomId]: [systemMsg]
    }));
    
    setActiveRoomId(newRoomId);
    setNewRoomName("");
    setSelectedBugId("");
    toast.success("Chat room created successfully!");
  };

  const handleJoinRoom = () => {
    if (!joinCode) {
      toast.error("Please enter a room code");
      return;
    }

    const room = rooms.find(r => r.id === joinCode);
    if (!room) {
      toast.error("Invalid room code");
      return;
    }

    if (!room.participants.includes(currentUser.id)) {
      // Add user to room participants
      const updatedRooms = rooms.map(r => 
        r.id === joinCode 
          ? { ...r, participants: [...r.participants, currentUser.id] }
          : r
      );
      setRooms(updatedRooms);

      // Add system message about user joining
      const joinMsg: ChatMessage = {
        id: `msg${Date.now()}`,
        senderId: "system",
        senderName: "System",
        content: `${currentUser.name} joined the chat.`,
        timestamp: new Date().toISOString(),
        isSystem: true
      };

      setMessages(prev => ({
        ...prev,
        [joinCode]: [...(prev[joinCode] || []), joinMsg]
      }));
    }

    setActiveRoomId(joinCode);
    setJoinCode("");
    toast.success("Joined chat room successfully!");
  };

  const copyRoomCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Room code copied to clipboard!");
  };

  const leaveRoom = () => {
    if (!activeRoomId) return;
    
    // Add system message about user leaving
    const leaveMsg: ChatMessage = {
      id: `msg${Date.now()}`,
      senderId: "system",
      senderName: "System",
      content: `${currentUser.name} left the chat.`,
      timestamp: new Date().toISOString(),
      isSystem: true
    };

    setMessages(prev => ({
      ...prev,
      [activeRoomId]: [...(prev[activeRoomId] || []), leaveMsg]
    }));

    // Remove user from participants
    const updatedRooms = rooms.map(r => 
      r.id === activeRoomId 
        ? { 
            ...r, 
            participants: r.participants.filter(id => id !== currentUser.id) 
          }
        : r
    );
    setRooms(updatedRooms);
    
    setActiveRoomId(null);
    toast.info("Left chat room");
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const canHostChat = can('host_chat');
  const canJoinChat = can('join_chat');

  if (!canHostChat && !canJoinChat) {
    return (
      <div className="p-6">
        <div className="p-4 border border-red-300 bg-red-50 rounded-md flex items-start gap-2">
          <div className="flex-1">
            <h2 className="text-lg font-medium">Access Denied</h2>
            <p className="text-sm">You don't have permission to access chat rooms.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const activeRoom = rooms.find(r => r.id === activeRoomId);
  const userRooms = rooms.filter(room => room.participants.includes(currentUser.id));
  const isUserHost = activeRoom?.host === currentUser.id;

  return (
    <div className="container max-w-6xl mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Chat Rooms</h1>
        <p className="text-gray-500">Collaborate on bug fixes in real time</p>
      </div>

      <Tabs 
        defaultValue={activeTab} 
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as 'host' | 'join')}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 max-w-md mb-4">
          {canHostChat && (
            <TabsTrigger value="host" disabled={!canHostChat}>
              <MessageSquare className="h-4 w-4 mr-2" /> Host Chat Room
            </TabsTrigger>
          )}
          {canJoinChat && (
            <TabsTrigger value="join" disabled={!canJoinChat}>
              <UserPlus className="h-4 w-4 mr-2" /> Join Chat Room
            </TabsTrigger>
          )}
        </TabsList>
        
        {canHostChat && (
          <TabsContent value="host" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Host a Chat Room</CardTitle>
                <CardDescription>Create a new chat room for bug collaboration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="roomName" className="text-sm font-medium">
                    Room Name
                  </label>
                  <Input
                    id="roomName"
                    placeholder="Bug discussion room..."
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="bugSelect" className="text-sm font-medium">
                    Select Bug
                  </label>
                  <select 
                    id="bugSelect" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={selectedBugId}
                    onChange={(e) => setSelectedBugId(e.target.value)}
                  >
                    <option value="">Select a bug...</option>
                    {availableBugs.map(bug => (
                      <option key={bug.id} value={bug.id}>
                        {bug.title}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleCreateRoom}>Create Chat Room</Button>
              </CardFooter>
            </Card>

            <h2 className="text-xl font-semibold mt-6">Your Hosted Rooms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rooms.filter(room => room.host === currentUser.id).map(room => (
                <Card key={room.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle>{room.name}</CardTitle>
                    <div className="flex justify-between items-center">
                      <CardDescription>
                        {room.participants.length} participant{room.participants.length !== 1 ? 's' : ''}
                      </CardDescription>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyRoomCode(room.id)}
                      >
                        <Copy className="h-4 w-4 mr-1" /> {room.id}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardFooter className="pt-2">
                    <Button 
                      className="w-full"
                      onClick={() => setActiveRoomId(room.id)}
                      variant={activeRoomId === room.id ? "secondary" : "default"}
                    >
                      {activeRoomId === room.id ? "Currently Active" : "Enter Chat Room"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              {rooms.filter(room => room.host === currentUser.id).length === 0 && (
                <div className="col-span-2 p-8 text-center border rounded-lg border-dashed text-gray-500">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>You haven't created any chat rooms yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
        )}
        
        {canJoinChat && (
          <TabsContent value="join" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Join a Chat Room</CardTitle>
                <CardDescription>Enter a room code to join a discussion</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter room code..."
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                  />
                  <Button onClick={handleJoinRoom}>Join</Button>
                </div>
              </CardContent>
            </Card>

            <h2 className="text-xl font-semibold mt-6">Your Joined Rooms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rooms
                .filter(room => room.participants.includes(currentUser.id) && room.host !== currentUser.id)
                .map(room => (
                  <Card key={room.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle>{room.name}</CardTitle>
                      <CardDescription>
                        Hosted by {room.hostName} • {room.participants.length} participants
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-2">
                      <Button 
                        className="w-full"
                        onClick={() => setActiveRoomId(room.id)}
                        variant={activeRoomId === room.id ? "secondary" : "default"}
                      >
                        {activeRoomId === room.id ? "Currently Active" : "Enter Chat Room"}
                      </Button>
                    </CardFooter>
                  </Card>
              ))}
              {rooms.filter(room => room.participants.includes(currentUser.id) && room.host !== currentUser.id).length === 0 && (
                <div className="col-span-2 p-8 text-center border rounded-lg border-dashed text-gray-500">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>You haven't joined any chat rooms yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
        )}
      </Tabs>

      {activeRoomId && (
        <Card className="mt-6">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle>{activeRoom?.name}</CardTitle>
              <CardDescription>
                Hosted by {activeRoom?.hostName} • {activeRoom?.participants.length} participants
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyRoomCode(activeRoomId)}
              >
                <Copy className="h-4 w-4 mr-1" /> Copy Room Code
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={leaveRoom}
              >
                Leave
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border-t border-b h-[400px] flex flex-col">
              <div className="p-4 bg-muted/30 border-b flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="font-medium text-sm">
                  {activeRoom?.participants.length} Participant{activeRoom && activeRoom.participants.length !== 1 ? 's' : ''}
                </span>
              </div>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages[activeRoomId]?.map(message => (
                    <div 
                      key={message.id}
                      className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`
                          max-w-[80%] rounded-lg p-3
                          ${message.isSystem 
                            ? 'bg-muted/30 text-center italic w-full text-sm text-gray-500' 
                            : message.senderId === currentUser.id 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'}
                        `}
                      >
                        {!message.isSystem && (
                          <div className="font-semibold text-xs mb-1">
                            {message.senderId === currentUser.id ? 'You' : message.senderName}
                          </div>
                        )}
                        <div>{message.content}</div>
                        <div className="text-xs mt-1 opacity-70 text-right">
                          {formatTimestamp(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </div>
          </CardContent>
          <CardFooter className="pt-4">
            <div className="flex w-full gap-2">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button onClick={handleSendMessage}>
                <SendHorizonal className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ChatRoom;
