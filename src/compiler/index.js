import { insert } from '../util/FileEditor';
import { convertKeyword } from '../parser';

export class Compiler {
	constructor({ template, output }) {
		this.template = template;
		this.output = output;
		this.match = '';
		this.queue = [];
	}
	// compiler.comment('add').before.insert('yourContent');
	comment(scope, name) {
		const scopeName = name ? scope : 'bb-mt';
		const funcName = name ? name : scope;
		this.match = '@' + scopeName + ' ' + funcName;

		return {
			before: {
				insert: content => {
					this.queue.push({
						action: 'insert',
						point: 'before',
						content: convertKeyword(content)
					});
				}
			},
			after: {
				insert: content => {
					this.queue.push({
						action: 'insert',
						point: 'after',
						content: convertKeyword(content)
					})
				}
			}
		};
	}
	// 启动编译
	async start() {
		this.queue.forEach(async ({
			action,
			point,
			content
		}) => {
			if (action === 'insert') {
				await insert({
					point,
					content,
					output: this.output,
					match: this.match
				});
			} 
		});
	}
}

