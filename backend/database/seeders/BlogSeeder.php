<?php

namespace Database\Seeders;

use App\Models\BlogPost;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BlogSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();
        if (! $admin) return;

        $posts = [
            [
                'title'     => 'Xu hướng quà tặng doanh nghiệp 2025: Cá nhân hóa lên ngôi',
                'slug'      => 'qua-tang-doanh-nghiep-2025',
                'category'  => 'Xu hướng quà tặng',
                'author'    => 'Team GiftCraft',
                'mins'      => 5,
                'published' => '2025-11-15',
                'seed'      => 'blog-trend-2025',
                'excerpt'   => 'Thay vì hộp quà Tết đồng loạt, các doanh nghiệp hàng đầu đang đầu tư vào quà tặng được thiết kế riêng cho từng đối tác và nhân viên. Tìm hiểu tại sao xu hướng này đang bùng nổ.',
                'content'   => <<<HTML
<p>Năm 2025 chứng kiến sự thay đổi căn bản trong cách các doanh nghiệp Việt Nam tiếp cận văn hóa quà tặng. Nếu trước đây, một hộp quà Tết đồng loạt cho toàn bộ nhân viên là đủ, thì nay người nhận đang kỳ vọng nhiều hơn — họ muốn cảm thấy được coi trọng như một cá nhân.</p>

<h2>Tại sao cá nhân hóa trở thành tiêu chuẩn mới?</h2>
<p>Nghiên cứu từ McKinsey cho thấy 76% người tiêu dùng có xu hướng mua hàng từ thương hiệu cá nhân hóa trải nghiệm. Nguyên tắc tương tự áp dụng cho quà tặng doanh nghiệp: khi một đối tác nhận được hộp quà có in tên họ, được chọn dựa trên sở thích cá nhân, tỷ lệ họ nhớ đến thương hiệu của bạn tăng lên 3 lần.</p>

<h2>3 cấp độ cá nhân hóa</h2>
<ul>
  <li><strong>Cấp 1 — In tên/logo:</strong> Đơn giản nhất. In tên người nhận hoặc logo công ty lên bao bì, thiệp. Chi phí thêm chỉ khoảng 15–20%.</li>
  <li><strong>Cấp 2 — Tùy chỉnh nội dung:</strong> Chọn sản phẩm phù hợp với sở thích, khẩu vị hoặc văn hóa của người nhận (ví dụ: quà không chứa thịt cho đối tác ăn chay).</li>
  <li><strong>Cấp 3 — Thiết kế riêng:</strong> Toàn bộ concept, bao bì, màu sắc được thiết kế theo nhận diện thương hiệu của doanh nghiệp. Dành cho đơn hàng từ 100 bộ trở lên.</li>
</ul>

<h2>Xu hướng vật liệu năm 2025</h2>
<p>Bên cạnh cá nhân hóa, vật liệu bền vững đang là yếu tố quan trọng hàng đầu. Các doanh nghiệp FDI và startup công nghệ đặc biệt chú trọng điều này — họ không muốn bị gắn mác "gây ô nhiễm" chỉ vì hộp quà Tết.</p>
<p>Giấy kraft tái chế, hộp gỗ tràm trồng rừng, túi vải canvas và nhãn dán in bằng mực gốc nước đang dần thay thế những hộp nhựa cứng truyền thống.</p>

<h2>Kết luận</h2>
<p>Đầu tư vào quà tặng cá nhân hóa không chỉ là xu hướng — đó là chiến lược xây dựng quan hệ bền vững. Một món quà được chọn lựa kỹ càng nói lên điều mà hàng chục email cảm ơn không thể truyền đạt.</p>
<p><em>GiftCraft Studio cung cấp dịch vụ thiết kế quà tặng doanh nghiệp cá nhân hóa từ 20 bộ trở lên. Liên hệ ngay để được tư vấn miễn phí.</em></p>
HTML,
            ],
            [
                'title'     => 'Cách chọn quà tặng đối tác kinh doanh gây ấn tượng lâu dài',
                'slug'      => 'chon-qua-tang-doi-tac',
                'category'  => 'Bí quyết B2B',
                'author'    => 'Minh Tuấn',
                'mins'      => 4,
                'published' => '2025-11-10',
                'seed'      => 'blog-b2b-tips',
                'excerpt'   => '5 tiêu chí quan trọng khi lựa chọn quà tặng doanh nghiệp phù hợp với văn hóa và giá trị thương hiệu.',
                'content'   => <<<HTML
<p>Chọn quà cho đối tác kinh doanh khác hoàn toàn với chọn quà cho bạn bè. Một sai lầm nhỏ có thể vô tình tạo ra sự khó chịu hoặc thậm chí xúc phạm — đặc biệt khi đối tác đến từ nền văn hóa khác. Dưới đây là 5 tiêu chí giúp bạn không bao giờ chọn sai.</p>

<h2>1. Phù hợp với giá trị thương hiệu của bạn</h2>
<p>Quà tặng là đại sứ thương hiệu. Nếu công ty bạn đề cao sự bền vững — tặng sản phẩm từ vật liệu tái chế. Nếu bạn định vị là doanh nghiệp cao cấp — đừng tặng đồ giá rẻ dù có bao bì đẹp. Người nhận luôn để ý đến sự nhất quán giữa hình ảnh và hành động.</p>

<h2>2. Hiểu đúng về văn hóa đối tác</h2>
<p>Một số nguyên tắc cơ bản:</p>
<ul>
  <li>Đối tác Nhật: tránh tặng số 4 (tứ = chết), luôn tặng đồ đôi, bao bì phải hoàn hảo.</li>
  <li>Đối tác Hàn: rượu là quà tặng phổ biến và được đánh giá cao.</li>
  <li>Đối tác Hồi giáo: tuyệt đối không tặng rượu hay sản phẩm từ lợn.</li>
  <li>Đối tác Việt Nam truyền thống: tránh tặng đồng hồ (biểu tượng thời gian tàn), giày dép (có ý nghĩa muốn đuổi người đi).</li>
</ul>

<h2>3. Cân bằng giữa thực dụng và cảm xúc</h2>
<p>Quà tặng doanh nghiệp tốt nhất phải vừa có tính thực dụng (được sử dụng hàng ngày) vừa gợi lên cảm xúc tích cực. Bình giữ nhiệt khắc logo đáp ứng cả hai: CEO dùng mỗi sáng và mỗi lần nhìn vào lại nhớ đến công ty bạn.</p>

<h2>4. Ngân sách tỉ lệ với tầm quan trọng</h2>
<p>Không cần chi quá nhiều, nhưng cũng đừng tiết kiệm sai chỗ. Hướng dẫn tổng quát:</p>
<ul>
  <li>Nhân viên thông thường: 200,000 – 500,000đ/bộ</li>
  <li>Đối tác trung cấp: 500,000 – 1,000,000đ/bộ</li>
  <li>CEO/C-suite/đối tác chiến lược: 1,000,000 – 3,000,000đ/bộ</li>
</ul>

<h2>5. Thời điểm và cách trao tặng</h2>
<p>Một món quà tốt nhưng trao không đúng lúc vẫn có thể mất đi ý nghĩa. Trao trực tiếp bao giờ cũng có giá trị hơn gửi bưu điện. Nếu không thể gặp mặt, hãy kèm theo thư tay viết tay — không phải email tự động.</p>
HTML,
            ],
            [
                'title'     => 'Câu chuyện: 500 bộ quà Tết Vingroup — Hành trình 3 tuần không ngủ',
                'slug'      => 'vingroup-fpt-qua-tang',
                'category'  => 'Câu chuyện thương hiệu',
                'author'    => 'Lan Anh',
                'mins'      => 7,
                'published' => '2025-10-28',
                'seed'      => 'blog-vingroup-story',
                'excerpt'   => 'Đằng sau dự án 500 bộ quà tặng nhân viên Vingroup — hành trình thiết kế, thử nghiệm và sản xuất trong 3 tuần đầy căng thẳng.',
                'content'   => <<<HTML
<p>Ngày 3 tháng 12 năm 2024, điện thoại của CEO GiftCraft Studio đổ chuông lúc 10 giờ tối. Đầu dây bên kia là giám đốc nhân sự của một tập đoàn lớn: <em>"Chúng tôi cần 500 bộ quà Tết. Có hộp gỗ, in logo, đủ loại đặc sản. Deadline: 23 tháng Chạp — tức là còn đúng 21 ngày."</em></p>

<blockquote>
<p>"21 ngày. 500 bộ. Thiết kế chưa có. Nguồn hàng chưa chốt. Nhưng chúng tôi nói: được."</p>
</blockquote>

<h2>Tuần 1: Chạy đua với thiết kế</h2>
<p>Ngay sáng hôm sau, đội thiết kế họp lúc 7 giờ sáng. Yêu cầu rõ ràng: hộp gỗ khắc laser logo, màu đỏ-vàng đặc trưng, chứa tối thiểu 8 loại sản phẩm. Khó nhất là tìm đủ 8 loại đặc sản chất lượng với số lượng 500 đơn vị mỗi loại — trong mùa Tết, mọi nhà cung cấp đều đã kín lịch.</p>
<p>Sau 48 giờ gọi điện không ngừng, chúng tôi chốt được: chè Thái Nguyên từ hợp tác xã Tân Cương, mứt sen Đầm Sen, hạt macca Đắk Lắk, bánh đậu xanh Hải Dương, cà phê Buôn Ma Thuột, nước mắm Phú Quốc nhãn riêng, rượu gạo Làng Vân và rượu sim Phú Quốc.</p>

<h2>Tuần 2: Sản xuất và đóng gói</h2>
<p>Hộp gỗ được đặt từ xưởng mộc tại Bình Dương — 500 cái, khắc laser tên và logo riêng biệt. Mỗi hộp phải kiểm tra kỹ trước khi xuất xưởng. Song song đó, 8 loại sản phẩm được nhập về kho và kiểm đếm từng cái.</p>
<p>Đội đóng gói làm việc 3 ca liên tục. Mỗi hộp được xếp theo thứ tự cố định — nặng phía dưới, nhẹ phía trên — để đảm bảo hộp không bị lệch khi vận chuyển. Một bộ đóng gói mất trung bình 8 phút.</p>

<h2>Tuần 3: Giao hàng và phút giây căng thẳng</h2>
<p>Ngày 22 tháng Chạp, toàn bộ 500 hộp đã sẵn sàng. Nhưng đúng lúc xe tải chuẩn bị lăn bánh, mưa lớn bất ngờ đổ xuống. Chúng tôi phải bọc thêm 500 lớp nilon cho từng hộp để đảm bảo hàng khô ráo khi đến tay người nhận.</p>
<p>Cuối cùng, 500 hộp quà đến đúng giờ. Giám đốc nhân sự gửi một tin nhắn ngắn: <em>"Tuyệt vời. Gặp lại năm sau."</em></p>

<h2>Bài học rút ra</h2>
<p>Dự án Vingroup dạy chúng tôi một điều quan trọng: khi deadline gấp, thứ cứu bạn không phải là tiền hay công nghệ — mà là mạng lưới nhà cung cấp đáng tin cậy và đội ngũ sẵn sàng làm việc cả đêm. GiftCraft đã xây dựng cả hai trong 3 năm qua, và đây là thành quả.</p>
HTML,
            ],
            [
                'title'     => 'Thiết kế hộp quà Tết doanh nghiệp: Từ ý tưởng đến sản phẩm',
                'slug'      => 'hop-qua-tet-doanh-nghiep',
                'category'  => 'Hướng dẫn',
                'author'    => 'Team GiftCraft',
                'mins'      => 6,
                'published' => '2025-11-05',
                'seed'      => 'blog-tet-guide',
                'excerpt'   => 'Quy trình 4 bước để tạo ra bộ quà Tết đẳng cấp mang thương hiệu riêng — từ chọn sản phẩm đến in ấn và đóng gói.',
                'content'   => <<<HTML
<p>Mỗi năm, hàng nghìn doanh nghiệp Việt Nam đặt câu hỏi: "Làm thế nào để hộp quà Tết của mình khác với 99% hộp quà ngoài thị trường?" Câu trả lời không phức tạp — chỉ cần có quy trình đúng và đủ thời gian.</p>

<h2>Bước 1: Xác định ngân sách và số lượng (Tuần 1)</h2>
<p>Đây là bước đặt nền tảng cho mọi quyết định tiếp theo. Ngân sách/bộ sẽ quyết định loại bao bì, số lượng sản phẩm và mức độ cá nhân hóa. Số lượng sẽ ảnh hưởng đến thời gian sản xuất và chi phí đơn vị.</p>
<p><strong>Lưu ý quan trọng:</strong> Với đơn hàng Tết, bạn cần đặt trước ít nhất 6–8 tuần. Để năm 2026, hãy bắt đầu lên kế hoạch từ tháng 10.</p>

<h2>Bước 2: Chọn concept và sản phẩm (Tuần 2–3)</h2>
<p>Concept tốt phải trả lời được câu hỏi: "Khi người nhận mở hộp, họ sẽ cảm thấy gì?" Gợi ý một số concept phổ biến:</p>
<ul>
  <li><strong>Bản sắc Việt:</strong> Đặc sản vùng miền, thiết kế truyền thống — thích hợp cho doanh nghiệp muốn thể hiện tự hào dân tộc.</li>
  <li><strong>Premium Minimalist:</strong> Ít sản phẩm hơn nhưng chất lượng cao — thích hợp cho C-suite và đối tác nước ngoài.</li>
  <li><strong>Wellness & Health:</strong> Trà, mật ong, thực phẩm sức khỏe — xu hướng tăng mạnh sau COVID-19.</li>
</ul>

<h2>Bước 3: Thiết kế bao bì (Tuần 3–4)</h2>
<p>Bao bì chiếm 30–40% ấn tượng tổng thể. Những yếu tố cần cân nhắc:</p>
<ul>
  <li>Màu sắc: phải nhất quán với màu thương hiệu công ty.</li>
  <li>Logo placement: nổi bật nhưng không thô. Khắc laser, dập nổi hoặc in UV spot là các kỹ thuật cao cấp.</li>
  <li>Vật liệu: hộp gỗ > hộp cứng > hộp carton. Chi phí tăng dần nhưng ấn tượng cũng tăng đáng kể.</li>
</ul>

<h2>Bước 4: Kiểm duyệt mẫu và sản xuất đại trà</h2>
<p>Luôn yêu cầu mẫu thực tế trước khi sản xuất. Kiểm tra: màu in có đúng không, logo có sắc nét không, bao bì có chắc chắn không, sản phẩm có vừa vặn không. Một lỗi nhỏ nhân cho 500 bộ sẽ rất tốn kém để khắc phục.</p>
<p>Sau khi duyệt mẫu, thời gian sản xuất thường là 1–2 tuần tùy số lượng và độ phức tạp.</p>
HTML,
            ],
            [
                'title'     => 'Quà tặng eco-friendly: Xu hướng không thể bỏ qua của doanh nghiệp hiện đại',
                'slug'      => 'qua-tang-eco-friendly',
                'category'  => 'Xu hướng quà tặng',
                'author'    => 'Hải Yến',
                'mins'      => 3,
                'published' => '2025-10-20',
                'seed'      => 'blog-eco',
                'excerpt'   => 'Bamboo, tái chế, hữu cơ — các vật liệu bền vững đang trở thành lựa chọn ưu tiên của doanh nghiệp hiện đại có trách nhiệm với môi trường.',
                'content'   => <<<HTML
<p>Khi phong trào ESG (Môi trường, Xã hội, Quản trị) lan rộng vào các doanh nghiệp Việt Nam, quà tặng doanh nghiệp cũng không đứng ngoài cuộc. Ngày càng nhiều CEO từ chối nhận hoặc tặng đồ nhựa một lần — và họ đang tìm đến những lựa chọn xanh hơn.</p>

<h2>Vật liệu bền vững đang dẫn đầu</h2>
<p>Các vật liệu được ưa chuộng nhất năm 2025:</p>
<ul>
  <li><strong>Tre và bamboo:</strong> Việt Nam là nước xuất khẩu tre lớn của ASEAN. Hộp tre, muỗng tre, đũa bamboo — đẹp, bền và có câu chuyện.</li>
  <li><strong>Giấy kraft tái chế:</strong> Thay thế hoàn toàn hộp nhựa và túi nylon. In được, dán được, và phân hủy sinh học.</li>
  <li><strong>Vải canvas hữu cơ:</strong> Túi tote canvas thay thế túi nylon là ví dụ kinh điển nhất — người nhận dùng hàng năm, mỗi lần nhìn lại nhớ đến thương hiệu.</li>
  <li><strong>Thủy tinh và gốm:</strong> Hũ thủy tinh, bình gốm Bát Tràng — sang trọng, không độc hại và tái sử dụng được mãi.</li>
</ul>

<h2>Lợi ích vượt ra ngoài môi trường</h2>
<p>Chọn quà tặng xanh không chỉ tốt cho Trái Đất — nó còn tốt cho thương hiệu của bạn. Một nghiên cứu tại Singapore cho thấy 68% nhân viên thế hệ Z và Millennial đánh giá cao hơn về công ty khi nhận được quà tặng bền vững, so với quà xa xỉ truyền thống.</p>

<h2>GiftCraft eco line</h2>
<p>GiftCraft Studio ra mắt dòng sản phẩm "Xanh" từ năm 2024 — toàn bộ bao bì là giấy kraft tái chế, nội dung ưu tiên sản phẩm hữu cơ và thủ công địa phương. Thêm 10% chi phí, nhưng nhận được 100% thiện cảm từ đối tác.</p>
HTML,
            ],
            [
                'title'     => 'Bảng giá B2B GiftCraft: Tiết kiệm đến 30% từ đơn 20 sản phẩm',
                'slug'      => 'b2b-pricing-guide',
                'category'  => 'Bí quyết B2B',
                'author'    => 'Team GiftCraft',
                'mins'      => 5,
                'published' => '2025-10-15',
                'seed'      => 'blog-pricing',
                'excerpt'   => 'Tất cả những gì bạn cần biết về bảng giá 5-tier của GiftCraft — từ cách tính đến tối ưu hóa ngân sách dự án quà tặng doanh nghiệp.',
                'content'   => <<<HTML
<p>Một trong những câu hỏi phổ biến nhất chúng tôi nhận được: "Đặt bao nhiêu bộ thì được giảm giá?" GiftCraft áp dụng mô hình định giá 5 cấp bậc — minh bạch, dễ tính và có lợi rõ ràng khi tăng số lượng.</p>

<h2>Bảng giá 5-tier của GiftCraft</h2>
<p>Tất cả sản phẩm GiftCraft đều áp dụng chiết khấu theo số lượng:</p>
<ul>
  <li><strong>20–49 bộ:</strong> Giảm 10% — Phù hợp nhóm nhỏ, bộ phận.</li>
  <li><strong>50–99 bộ:</strong> Giảm 15% — Toàn công ty vừa.</li>
  <li><strong>100–199 bộ:</strong> Giảm 20% — Doanh nghiệp trung bình.</li>
  <li><strong>200–299 bộ:</strong> Giảm 25% — Tập đoàn lớn.</li>
  <li><strong>300+ bộ:</strong> Giảm 30% — Đặt hàng số lượng lớn, ưu tiên sản xuất.</li>
</ul>

<h2>Ví dụ tính toán thực tế</h2>
<p>Giả sử bạn muốn đặt hộp quà "Thịnh Vượng" (giá lẻ: 850,000đ/bộ):</p>
<ul>
  <li>10 bộ: 850,000 × 10 = 8,500,000đ</li>
  <li>20 bộ: 765,000 × 20 = 15,300,000đ (tiết kiệm 1,700,000đ so với giá lẻ)</li>
  <li>100 bộ: 680,000 × 100 = 68,000,000đ (tiết kiệm 17,000,000đ)</li>
</ul>

<h2>Những gì được bao gồm trong giá B2B</h2>
<p>Không có phí ẩn. Giá B2B bao gồm:</p>
<ul>
  <li>In logo và tên công ty lên bao bì (thiết kế 1 lần)</li>
  <li>Kiểm định chất lượng từng bộ trước khi xuất</li>
  <li>Giao hàng toàn quốc (áp dụng từ 50 bộ)</li>
  <li>Hỗ trợ tư vấn và thiết kế không giới hạn</li>
</ul>

<h2>Quy trình đặt hàng B2B</h2>
<p>1. Điền form yêu cầu → 2. GiftCraft liên hệ tư vấn trong 2h → 3. Xác nhận mẫu và báo giá chính xác → 4. Ký hợp đồng và đặt cọc 30% → 5. Sản xuất và giao hàng.</p>
HTML,
            ],
            [
                'title'     => 'Ý tưởng quà tặng Trung Thu doanh nghiệp 2025: Vượt ra ngoài bánh trung thu',
                'slug'      => 'qua-tang-trung-thu-2025',
                'category'  => 'Xu hướng quà tặng',
                'author'    => 'Minh Tuấn',
                'mins'      => 4,
                'published' => '2025-10-05',
                'seed'      => 'blog-trung-thu',
                'excerpt'   => 'Những bộ quà Trung Thu sáng tạo kết hợp bánh truyền thống với sản phẩm handcraft cao cấp đang được ưa chuộng nhất năm 2025.',
                'content'   => <<<HTML
<p>Dịp Trung Thu là một trong những thời điểm bán quà tặng doanh nghiệp sôi động nhất năm — chỉ sau Tết Nguyên Đán. Nhưng năm 2025, rào cản giữa "hộp bánh trung thu" và "trải nghiệm quà tặng" đã gần như biến mất.</p>

<h2>Tại sao chỉ bánh trung thu là chưa đủ?</h2>
<p>Người nhận nhận 3–5 hộp bánh trung thu mỗi mùa. Hầu hết đều na ná nhau. Để tạo ấn tượng, doanh nghiệp cần thêm yếu tố khác biệt — và đó là cơ hội để thương hiệu của bạn tỏa sáng.</p>

<h2>3 concept Trung Thu đang hot nhất 2025</h2>

<h3>1. Trăng Rằm Hiện Đại</h3>
<p>Hộp thiếc tròn màu xanh navy đựng: 4 bánh trung thu nhân sen/đậu xanh/matcha, 1 hũ trà sữa hoàng trà, đèn lồng mini LED và sticker dán cửa sổ. Giá: 450,000–600,000đ/bộ.</p>

<h3>2. Trung Thu Thủ Công</h3>
<p>Hộp gỗ mộc đựng: 2 bánh trung thu handmade (không chất bảo quản), 1 gói trà shan tuyết, 1 hũ mật ong và bookmark thư pháp viết tên người nhận. Phù hợp cho đối tác và khách hàng VIP. Giá: 700,000–900,000đ/bộ.</p>

<h3>3. Eco Mooncake</h3>
<p>Hộp giấy kraft tái chế đựng: 4 bánh trung thu nhân hạt sen/kỷ tử (chay, không trứng), 1 túi trà thảo mộc và 1 bình đun nước trà bằng đất nung. Phù hợp cho doanh nghiệp định vị xanh. Giá: 380,000–500,000đ/bộ.</p>

<h2>Timeline đặt hàng Trung Thu</h2>
<p>Trung Thu 2025 rơi vào ngày 6 tháng 10. Để đảm bảo có hàng và thời gian thiết kế, hãy đặt trước ít nhất 6 tuần — tức là từ cuối tháng 8. GiftCraft nhận đặt hàng Trung Thu từ 1/8 hàng năm.</p>
HTML,
            ],
            [
                'title'     => 'Nghệ thuật đóng gói: Khi cái hộp quan trọng hơn món quà bên trong',
                'slug'      => 'nghe-thuat-dong-goi',
                'category'  => 'Hướng dẫn',
                'author'    => 'Lan Anh',
                'mins'      => 4,
                'published' => '2025-09-25',
                'seed'      => 'blog-packaging',
                'excerpt'   => 'Nghiên cứu tâm lý học cho thấy 40% ấn tượng của một món quà đến từ bao bì — trước khi người nhận biết bên trong có gì.',
                'content'   => <<<HTML
<p>Có một nghiên cứu nổi tiếng của Journal of Consumer Psychology: khi trao cùng một chiếc đồng hồ trong hai loại hộp — hộp giấy thường và hộp velvet sang trọng — người nhận đánh giá giá trị món quà cao hơn 43% khi được đựng trong hộp velvet. Sản phẩm giống nhau. Cảm giác hoàn toàn khác.</p>

<h2>Tâm lý học của unboxing</h2>
<p>Từ khi YouTube nổi lên, "unboxing" đã trở thành một nghi lễ. Người ta không chỉ mở hộp để lấy đồ — họ thưởng thức cả quá trình. Điều này áp dụng trực tiếp cho quà tặng doanh nghiệp: bao bì tốt tạo ra kỳ vọng và hứng khởi trước khi người nhận thấy sản phẩm thực.</p>

<h2>Nguyên tắc thiết kế bao bì quà tặng</h2>
<ul>
  <li><strong>Lớp đầu tiên:</strong> Hộp ngoài phải gây ấn tượng ngay. Màu sắc, logo và chất liệu quyết định 90% cảm nhận ban đầu.</li>
  <li><strong>Lớp thứ hai:</strong> Khi mở nắp hộp, người nhận thấy gì? Giấy lụa, ruy-băng hay lớp vải mỏng che đậy sản phẩm — tất cả tạo ra cảm giác khám phá.</li>
  <li><strong>Thiệp/card:</strong> Luôn đặt thiệp ở vị trí dễ thấy nhất khi mở hộp. Thiệp viết tay > thiệp in sẵn > không có thiệp.</li>
  <li><strong>Hương thơm:</strong> Bao bì thơm nhẹ (từ túi thơm mini hoặc giấy thơm) tạo ấn tượng đa giác quan.</li>
</ul>

<h2>Sai lầm phổ biến nhất trong đóng gói</h2>
<p>Sai lầm số 1: Logo quá to, che hết thiết kế. Thương hiệu cần hiện diện — nhưng không chiếm lĩnh. Tỷ lệ logo chiếm tối đa 15% diện tích mặt hộp là lý tưởng.</p>
<p>Sai lầm số 2: Sản phẩm bên trong không cố định, bị xê dịch khi vận chuyển. Luôn dùng foam, giấy tissue hoặc ngăn chia để cố định từng sản phẩm.</p>
<p>Sai lầm số 3: Quên kiểm tra hộp sau khi đóng và lắc nhẹ để đảm bảo không có tiếng kêu — tiếng kêu là dấu hiệu bao bì không đủ chắc.</p>
HTML,
            ],
        ];

        $adminUser = User::where('role', 'admin')->first();

        foreach ($posts as $p) {
            $authorUser = User::where('name', $p['author'])->first() ?? $adminUser;
            $seed = $p['seed'];

            BlogPost::updateOrCreate(
                ['slug' => $p['slug']],
                [
                    'author_id'        => $authorUser->id,
                    'title'            => $p['title'],
                    'excerpt'          => $p['excerpt'],
                    'content'          => $p['content'],
                    'cover_image'      => "https://picsum.photos/seed/{$seed}/1200/630",
                    'category'         => $p['category'],
                    'read_minutes'     => $p['mins'],
                    'status'           => 'published',
                    'published_at'     => $p['published'],
                    'meta_title'       => $p['title'] . ' | GiftCraft Studio',
                    'meta_description' => $p['excerpt'],
                ]
            );
        }
    }
}
