import { collection, config, fields } from "@keystatic/core";

export default config({
	storage: { kind: "local" },

	collections: {
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
						directory: "public/images/cars",
						publicPath: "/images/cars/",
					}),
					{
						label: "Ảnh xe",
						itemLabel: (props) => props.fields.value ?? "Ảnh",
					},
				),
				description: fields.markdoc({ label: "Mô tả" }),
			},
		}),
	},
});
