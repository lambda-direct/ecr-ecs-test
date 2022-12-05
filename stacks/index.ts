import { MyStack } from './MyStack';
import { App } from '@serverless-stack/resources';

export default function (app: App) {
	app.stack(MyStack, {
		stackName: `ecr-ecs-test-${app.stage}`,
	});
}
