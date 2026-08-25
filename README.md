# 🍅 FocusPomo

Ứng dụng Pomodoro viết bằng React + Vite.

**Chu kỳ mặc định:** 25p làm → 5p nghỉ → 25p làm → 5p nghỉ → 25p làm → 5p nghỉ → 25p làm → nghỉ dài 15–30p

## Chạy

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build production vào dist/
```

## Tính năng

- **Theme sáng / tối / theo hệ thống** — bấm nút ☀️🌙🖥️ ở góc phải hoặc chọn trong Cài đặt; lựa chọn lưu vào `localStorage` và không nháy màu khi tải lại trang
- Mặt đồng hồ SVG có vạch chia phút, cung gradient và chấm chạy ở đầu cung; co giãn theo bề ngang nên không tràn trên màn hình hẹp
- Nền ambient chuyển màu theo phiên (đỏ = làm, xanh lá = nghỉ ngắn, xanh dương = nghỉ dài), sắc độ tự chỉnh cho từng theme
- Hiện giờ kết thúc phiên ("kết thúc lúc 15:42") và nhịp đập cảnh báo ở 10 giây cuối
- Bộ đếm bám mốc thời gian thực (`Date.now()`) nên không trôi khi tab bị trình duyệt throttle
- Chu kỳ 8 phiên hiện bằng biểu tượng 🍅 làm / ☕ nghỉ ngắn / 🌴 nghỉ dài; phiên đang chạy có vòng tiến độ bao quanh, bấm để nhảy tới phiên bất kỳ
- **Phát nhạc khi hết phiên làm việc** — file `public/sounds/end-focus.mp3`; chỉnh âm lượng, thời lượng phát (mặc định 30s rồi fade-out) và nghe thử ngay trong Cài đặt
- Hết phiên nghỉ thì báo bằng chuông beep WebAudio; tự động chạy phiên kế tiếp (tắt được); thông báo trình duyệt
- Cài đặt thời lượng (nghỉ dài giới hạn 15–30p) và số phiên trước nghỉ dài — lưu vào `localStorage`
- Thống kê: số phiên tập trung, số chu kỳ hoàn tất, số phiên còn lại tới nghỉ dài
- Đếm ngược hiển thị ngay trên tiêu đề tab
- Phím tắt: `Space` chạy/dừng · `R` đặt lại phiên · `S` bỏ qua phiên

## Cấu trúc

```
src/
  lib/pomodoro.js         # buildCycle, durationOf, formatTime, hằng số phiên
  hooks/usePomodoro.js    # state máy đếm: start/pause/skip/goTo, tự chuyển phiên
  hooks/useAlarm.js       # chuông beep bằng WebAudio (không cần file)
  hooks/useEndMusic.js    # phát/fade-out bản nhạc kết thúc phiên làm việc
  hooks/useTheme.js       # sáng/tối/hệ thống, ghi vào <html data-theme>
  hooks/useLocalStorage.js
  components/TimerRing.jsx  # mặt đồng hồ
  components/CycleTrack.jsx # dãy biểu tượng chu kỳ
  components/Settings.jsx   # modal cài đặt
  components/icons.jsx      # bộ icon SVG
  components/phaseIcons.jsx # ánh xạ phiên/theme -> icon
  App.jsx
public/
  sounds/end-focus.mp3    # nhạc báo hết phiên làm việc — thay file này là đổi nhạc
```

## Đổi nhạc

Ghi đè `public/sounds/end-focus.mp3` bằng file khác (giữ nguyên tên) là xong, không cần sửa code.
