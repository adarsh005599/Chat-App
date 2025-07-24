import { createContext, useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import toast from 'react-hot-toast';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]); // sidebar users
  const [selectedUser, setSelectedUser] = useState(null); // current chat user
  const [unseenMessages, setUnseenMessages] = useState({}); // userId -> count

  const { socket, axios } = useContext(AuthContext);

  // ✅ Fetch sidebar users
  const getUsers = async () => {
    try {
      const { data } = await axios.get('/api/messages/users');
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages || {});
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // ✅ Fetch messages for selected user
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.message); // ✅ use `data.message` not `data.messages` (match your controller)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // ✅ Send a message
  const sendMessage = async (messageData) => {
    try {
      const payload = {
        ...messageData,
        receiverId: selectedUser._id.trim()
      };

      const { data } = await axios.post(`/api/messages/send`, payload);

      if (data.success) {
        setMessages((prevMessages) =>
          Array.isArray(prevMessages) ? [...prevMessages, data.newMessage] : [data.newMessage]
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // ✅ Handle incoming socket messages
  const subscribeToMessages = () => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      const senderId = newMessage.senderId?._id || newMessage.senderId;

      if (selectedUser && senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prevMessages) =>
          Array.isArray(prevMessages) ? [...prevMessages, newMessage] : [newMessage]
        );
        axios.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [senderId]: prev[senderId] ? prev[senderId] + 1 : 1
        }));
      }
    });
  };

  const unsubscribeFromMessages = () => {
    if (socket) socket.off("newMessage");
  };

  // ✅ Auto-fetch messages when a new user is selected
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  // ✅ Subscriptions on socket connect
  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [socket, selectedUser]);

  const value = {
    messages,
    users,
    selectedUser,
    getUsers,
    getMessages,
    sendMessage,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
