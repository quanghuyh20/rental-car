import { collection, config, fields, singleton } from "@keystatic/core";

export default config({
	storage: import.meta.env.DEV
		? { kind: "local" }
		: { kind: "github", repo: "quanghuyh20/rental-car" },

	singletons: {
		siteConfig: singleton({
			label: "Thông tin chung",
			path: "src/content/site-config",
			schema: {
				phone: fields.text({ label: "Số điện thoại" }),
				phoneDisplay: fields.text({ label: "SĐT hiển thị" }),
				email: fields.text({ label: "Email" }),
				address: fields.text({ label: "Địa chỉ" }),
				zaloUrl: fields.url({ label: "Link Zalo" }),
				facebookUrl: fields.url({ label: "Link Facebook" }),
				mapsUrl: fields.url({ label: "Link Google Maps" }),
			},
		}),
		aboutPage: singleton({
			label: "Trang giới thiệu",
			path: "src/content/about-page",
			format: { contentField: "story" },
			schema: {
				headline: fields.text({ label: "Tiêu đề chính" }),
				description: fields.text({
					label: "Mô tả ngắn",
					multiline: true,
				}),
				foundedYear: fields.integer({ label: "Năm thành lập" }),
				story: fields.markdoc({ label: "Câu chuyện công ty" }),
			},
		}),
	},

	collections: {
		blog: collection({
			label: "Blog",
			slugField: "title",
			path: "src/content/blog/*",
			format: { contentField: "content" },
			schema: {
				title: fields.slug({ name: { label: "Tiêu đề" } }),
				description: fields.text({
					label: "Mô tả ngắn",
					multiline: true,
				}),
				date: fields.date({ label: "Ngày đăng" }),
				author: fields.text({
					label: "Tác giả",
					defaultValue: "Nam Thanh Car",
				}),
				cover: fields.image({
					label: "Ảnh bìa",
					directory: "src/assets/blog",
					publicPath: "@/assets/blog/",
				}),
				locale: fields.select({
					label: "Ngôn ngữ",
					options: [
						{ label: "Tiếng Việt", value: "vi" },
						{ label: "English", value: "en" },
					],
					defaultValue: "vi",
				}),
				draft: fields.checkbox({
					label: "Bản nháp",
					defaultValue: false,
				}),
				cta: fields.conditional(
					fields.checkbox({
						label: "CTA tùy chỉnh",
						defaultValue: false,
					}),
					{
						true: fields.object({
							text: fields.text({ label: "Nội dung CTA" }),
							href: fields.url({ label: "Đường dẫn CTA" }),
						}),
						false: fields.empty(),
					},
				),
				content: fields.markdoc({
					label: "Nội dung",
					options: {
						image: {
							directory: "src/assets/blog",
							publicPath: "@/assets/blog/",
						},
					},
				}),
			},
		}),
		cars: collection({
			label: "Xe cho thuê",
			slugField: "name",
			path: "src/content/cars/*",
			format: { contentField: "description" },
			schema: {
				name: fields.slug({ name: { label: "Tên xe" } }),
				model: fields.text({ label: "Dòng xe (model)" }),
				seats: fields.integer({ label: "Số chỗ ngồi" }),
				transmission: fields.select({
					label: "Hộp số",
					options: [
						{ label: "Số tự động", value: "automatic" },
						{ label: "Số sàn", value: "manual" },
					],
					defaultValue: "automatic",
				}),
				fuel: fields.select({
					label: "Nhiên liệu",
					options: [
						{ label: "Xăng", value: "gasoline" },
						{ label: "Dầu", value: "diesel" },
						{ label: "Điện", value: "electric" },
					],
					defaultValue: "gasoline",
				}),
				pricePerDay: fields.integer({ label: "Giá thuê / ngày (VNĐ)" }),
				pricePerMonth: fields.integer({ label: "Giá thuê / tháng (VNĐ)" }),
				available: fields.checkbox({
					label: "Đang cho thuê",
					defaultValue: true,
				}),
				images: fields.array(
					fields.image({
						label: "Ảnh",
						directory: "src/assets/cars",
						publicPath: "../../assets/cars/",
					}),
					{
						label: "Ảnh xe",
						itemLabel: (props) =>
							(typeof props.value === "object" && props.value?.filename) ||
							"Ảnh",
					},
				),
				gallery: fields.array(
					fields.image({
						label: "Ảnh gallery",
						directory: "src/assets/cars/gallery",
						publicPath: "../../assets/cars/gallery/",
					}),
					{
						label: "Gallery xe",
						itemLabel: (props) =>
							(typeof props.value === "object" && props.value?.filename) ||
							"Ảnh",
					},
				),
				description: fields.markdoc({ label: "Mô tả" }),
			},
		}),
		services: collection({
			label: "Dịch vụ",
			slugField: "title",
			path: "src/content/services/*",
			format: { contentField: "content" },
			schema: {
				title: fields.slug({ name: { label: "Tên dịch vụ" } }),
				description: fields.text({
					label: "Mô tả ngắn",
					multiline: true,
				}),
				cover: fields.image({
					label: "Ảnh bìa",
					directory: "src/assets/services",
					publicPath: "../../assets/services/",
				}),
				content: fields.markdoc({ label: "Nội dung chi tiết" }),
			},
		}),
	},
});
