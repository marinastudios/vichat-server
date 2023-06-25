import mongodb from "mongoose";
import { MONGOOSE_URL, MONGOOSE_PASSWORD } from "$env/static/private";
const User = mongodb.models["User"] || mongodb.model(
	"User",
	new mongodb.Schema(
		{
			_id: {
				type: String,
				required: true
			}
		} as const,
		{ _id: false }
	)
);
const Key = mongodb.models["Key"] || mongodb.model(
	"Key",
	new mongodb.Schema(
		{
			_id: {
				type: String,
				required: true
			},
			user_id: {
				type: String,
				required: true
			},
			hashed_password: String
		} as const,
		{ _id: false }
	)
);
const Session = mongodb.models["Session"] || mongodb.model(
	"Session",
	new mongodb.Schema(
		{
			_id: {
				type: String,
				required: true
			},
			user_id: {
				type: String,
				required: true
			},
			active_expires: {
				type: Number,
				required: true
			},
			idle_expires: {
				type: Number,
				required: true
			}
		} as const,
		{ _id: false }
	)
);

mongodb.connect(MONGOOSE_URL.replace('<password>', MONGOOSE_PASSWORD))

export { Session, Key, User }
export default mongodb;