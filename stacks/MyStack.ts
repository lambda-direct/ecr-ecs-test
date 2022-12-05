import { StackContext } from '@serverless-stack/resources';
import ecs from 'aws-cdk-lib/aws-ecs';
import ec2 from 'aws-cdk-lib/aws-ec2';
import autoscaling from 'aws-cdk-lib/aws-autoscaling';

export function MyStack({ stack, app }: StackContext) {
	const cluster = new ecs.Cluster(stack, 'Cluster');

	const vpc = ec2.Vpc.fromLookup(stack, 'VPC', {
		isDefault: true,
	});

	const sg = new ec2.SecurityGroup(stack, 'SecurityGroup', {
		vpc,
	});

	sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80));

	const asg = new autoscaling.AutoScalingGroup(stack, 'ASG', {
		vpc,
		instanceType: new ec2.InstanceType('t3.micro'),
		machineImage: ecs.EcsOptimizedImage.amazonLinux(),
		securityGroup: sg,
		desiredCapacity: 1,
	});

	const asgCapacityProvider = new ecs.AsgCapacityProvider(
		stack,
		'ASGCapacityProvider',
		{
			autoScalingGroup: asg,
		},
	);

	cluster.addAsgCapacityProvider(asgCapacityProvider);

	const taskDef = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

	// Expose API Gateway on port 80 while the container is running on port 3000
	taskDef.addContainer('APIGatewayContainer', {
		image: ecs.ContainerImage.fromAsset('./containers/api-gateway'),
		memoryLimitMiB: 256,
		portMappings: [
			{
				containerPort: 3000,
				hostPort: 80,
			},
		],
	});

	taskDef.addContainer('Service1Container', {
		image: ecs.ContainerImage.fromAsset('./containers/service1'),
		memoryLimitMiB: 256,
		portMappings: [{ containerPort: 3001 }],
	});

	taskDef.addContainer('Service2Container', {
		image: ecs.ContainerImage.fromAsset('./containers/service2'),
		memoryLimitMiB: 256,
		portMappings: [{ containerPort: 3002 }],
	});

	const service = new ecs.Ec2Service(stack, 'Service1', {
		cluster,
		taskDefinition: taskDef,
	});
}
