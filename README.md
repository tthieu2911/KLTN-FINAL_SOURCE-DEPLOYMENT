#  LUẬN VĂN TỐT NGHIỆP 
## Đề tài: TÌM HIỂU CÔNG NGHỆ BLOCKCHAIN VÀ XÂY DỰNG ỨNG DỤNG MINH HỌA TRONG LĨNH VỰC THƯƠNG MẠI ĐIỆN TỬ

### Nhóm tác giả:
	.	1512008 - Hồ Nhật An 		- 1512008@student.hcmus.edu.vn - 0973732035
	.	1512162 - Trần Trung Hiếu 	- 1512162@student.hcmus.edu.vn - 0369115712

### Giáo viên hướng dẫn:
	.	Tiến sĩ Nguyễn Trần Minh Thư - Trưởng bộ môn Hệ thống Thông tin, Đại học Khoa Học Tự Nhiên


### Mục tiêu: 
	.	Quản lý được con đường xuất - nhập, mua - bán của các hàng hóa thông qua con đường thương mại điện tử. 
	.	Quản lý các hợp đồng giao dịch một cách tập trung, an toàn, minh bạch, không thể thay đổi sử dụng công nghệ blockchain.
	.	Đảm bảo tính trung thực về thông tin hàng hóa sau khi đi qua các đơn vị trung gian đến tay người tiêu dùng.

### Nội dung: 
	.	Xây dựng ứng dụng minh họa hệ thống quản lý chuỗi cung ứng trong lĩnh vực thương mại điện tử, có ứng dụng công nghệ blockchain vào quản lý các hợp đồng giao dịch, mua bán giữa các bên. 
	.	Đối tượng nhắm đến là các mô hình Thương mại điện tử quen thuộc: B2B, B2C, B2B2C.
	.	Thực hiện quản lý được con đường di chuyển của hàng hóa thông qua con đường thương mại điện tử đến tay người tiêu dùng.
	.	Thực hiện quản lý được một cách tập trung, minh bạch, bảo mật cho các giao dịch thương mại trên mạng Internet.
	.	Thực hiện quản lý được thông tin hàng hóa khó bị sai lệch, chỉnh sửa sau khi vận chuyển qua các đơn vị trung gian đến tay người tiêu dùng

### Kết quả đạt được: 
	.	Xây dựng thành công hệ thống quản lý chuỗi cung ứng ở mức độ cơ bản, triển khai đúng được theo ý tưởng workflow đề xuất; 
	.	Ứng dụng được công nghệ blockchain **Hyperledger Fabric** trong việc tạo và quản lý các hợp đồng giao dịch.

***

###	Workflow
![../../../THESIS/HTML/images/FIG03-03.gif]


###	Có 5 loại người dùng:

## 	Manufacturer: Nhà sản xuất.
	+ Chức năng riêng:
		.	Xem danh sách hàng hóa trong kho chứa hàng
		.	Thêm sản phẩm vào kho chứa hàng
		.	Chỉnh sửa thông tin sản phẩm
		.	Xóa sản phẩm khỏi kho chứa hàng
		
		.	Gửi đơn báo giá cho người mua (sau khi người mua đặt hàng). Khi đó sẽ yêu cầu nhập địa chỉ đến nhận hàng (mặc định sẽ tự lưu là địa chỉ cá nhân của Manufacturer)
		.	Cho phép vận chuyển hàng hóa (sau khi người mua chấp nhận báo giá)
		.	Xác nhận đơn báo chi phí vận chuyển từ Shipper (Sau khi Shipper gửi đơn báo giá)
		
		.	Hủy đơn hàng (Chỉ được phép hủy trước khi "chấp nhận báo giá")
		
		.	Xem danh sách đơn hàng đã bán thành công
		.	Xem thông tin chi tiết đơn bán hàng
		
##	Supplier: Nhà phân phối.
	+ Chức năng riêng:
		.	Xem danh sách hàng hóa trong kho chứa hàng
		.	Xóa sản phẩm khỏi kho chứa hàng
		
		.	Mua sản phẩm từ Manufacturer (chỉ từ Manufacturer thôi nha, không có mua của nhau) - tức là Tạo đơn mua hàng. Khi đó sẽ yêu cầu nhập địa chỉ giao hàng (mặc định sẽ tự lưu là địa chỉ cá nhân của Supplier)
		.	Chấp nhận đơn báo giá từ Manufacturer (sau khi Manufacturer gửi đơn báo giá)
		.	Xác nhận nhận hàng (Khi đó thì số lượng hàng sẽ được cộng vào kho chứa)
		
		.	Bán sản phẩm cho Retailer (Chỉ bán được cho Retailer)
		.	Gửi đơn báo giá cho người mua (sau khi người mua đặt hàng). Khi đó sẽ yêu cầu nhập địa chỉ đến nhận hàng (mặc định sẽ tự lưu là địa chỉ cá nhân của Supplier)
		.	Cho phép vận chuyển hàng hóa (sau khi người mua chấp nhận báo giá)
		.	Xác nhận đơn báo chi phí vận chuyển từ Shipper (Sau khi Shipper gửi đơn báo giá)
		
		.	Hủy đơn hàng (Chỉ được phép hủy trước khi "chấp nhận báo giá")
		
		.	Xem danh sách đơn hàng đã mua thành công
		.	Xem danh sách đơn hàng đã bán thành công
		.	Xem thông tin chi tiết đơn mua hàng
		.	Xem thông tin chi tiết đơn bán hàng
		
##	Retailer: Nhà bán lẻ.
	+ Chức năng riêng:
		.	Xem danh sách hàng hóa trong kho chứa hàng
		.	Xóa sản phẩm khỏi kho chứa hàng
		
		.	Mua sản phẩm từ Supplier (chỉ từ Supplier thôi nha, không có mua của nhau) - tức là Tạo đơn mua hàng. Khi đó sẽ yêu cầu nhập địa chỉ giao hàng (mặc định sẽ tự lưu là địa chỉ cá nhân Retailer)
		.	Chấp nhận đơn báo giá từ Supplier (sau khi Supplier gửi đơn báo giá)
		.	Xác nhận nhận hàng (Khi đó thì số lượng hàng sẽ được cộng vào kho chứa)
		
		.	Bán sản phẩm cho Customer (Chỉ bán được cho Customer)
		.	Gửi đơn báo giá cho người mua (sau khi người mua đặt hàng). Khi đó sẽ yêu cầu nhập địa chỉ đến nhận hàng (mặc định sẽ tự lưu là địa chỉ cá nhân của Retailer)
		.	Cho phép vận chuyển hàng hóa (sau khi người mua chấp nhận báo giá)
		.	Xác nhận đơn báo chi phí vận chuyển từ Shipper (Sau khi Shipper gửi đơn báo giá)
		
		.	Hủy đơn hàng (Chỉ được phép hủy trước khi "chấp nhận báo giá")
		
		.	Xem danh sách đơn hàng đã mua thành công
		.	Xem danh sách đơn hàng đã bán thành công
		.	Xem thông tin chi tiết đơn mua hàng
		.	Xem thông tin chi tiết đơn bán hàng
		
##	Customer: Người tiêu dùng.
	+ Chức năng riêng:
		.	Mua sản phẩm từ Retailer (chỉ từ Retailer, không mua được từ Manufacturer hay supplier) - tức là Tạo đơn mua hàng. Khi đó sẽ yêu cầu nhập địa chỉ giao hàng (mặc định sẽ tự lưu là địa chỉ cá nhân của Customer)
		.	Chấp nhận đơn báo giá từ Retailer (sau khi Retailer gửi đơn báo giá)
		.	Xác nhận nhận hàng từ shipper (sau khi shipper nhận hàng thành công và vận chuyển đi. Khi đó số lượng hàng tương ứng được cộng vào "kho chứa" để lưu vết giao dịch)
		
		.	Hủy đơn hàng (Chỉ được phép hủy trước khi "chấp nhận báo giá")
		
		.	Xem danh sách đơn hàng đã mua thành công
		.	Xem thông tin chi tiết đơn mua hàng
		
##	Shipper: Người vận chuyển.
	+ Chức năng riêng:
		.	Nhận đơn hàng và gửi đơn báo giá đến cho người bán (Sau khi người bán cho phép vận chuyển)
		.	Xác nhận nhận hàng để vận chuyển (Sau khi người bán chấp nhận đơn báo giá)
		.	Hủy đơn hàng đã nhận (Sau đó Shipper khác sẽ thấy đơn hàng đó và nhận được. Chỉ được hủy trước khi người bán chấp nhận đơn báo giá)

		.	Xem danh sách đơn giao hàng đã giao thành công
		.	Xem thông tin chi tiết đơn giao hàng
		
			
###	Chức năng chung:
	.	Xem và chỉnh sửa thông tin cá nhân
	.	Đổi mật khẩu


##	Administrator:	Quản lý hệ thống.
	+ Chức năng:
		.	Thêm người dùng mới (có kèm LOẠI người dùng. Còn khi bình thường đăng ký chưa là người dùng nào hết. Chưa đăng nhập hệ thống được)
		.	Xem danh sách tài khoản người dùng
		.	Chỉnh sửa hồ sơ người dùng (chỉnh sửa LOẠI người dùng cho những account chưa có loại)
		.	Xóa người dùng
		
##	Tài khoản đăng nhập:

	*	Manufacturer:		manufacturer	/	123456
	*	Supplier:		supplier	/	123456
	*	Retailer:		retailer	/	123456
	*	Customer:		customer	/	123456
	*	Shipper:		shipper		/	123456
	
	
	**	ADMIN:			admin		/	admin@123
		
		
