package moum.project.service;

import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import moum.project.dao.ChatDao;
import moum.project.vo.Chat;
import moum.project.vo.Chatroom;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DefaultChatService implements ChatService {

  private final ChatDao chatDao;

  @Override
  public List<Chat> loadChat(Map map) throws Exception {
    return chatDao.listChat(map);
  }

  @Override
  public List<Chatroom> listRoom(int userNo) throws Exception {
    return chatDao.listRoom(userNo);
  }

  @Override
  public Chatroom getRoom(int roomNo) throws Exception {
    return chatDao.findRoom(roomNo);
  }
}
