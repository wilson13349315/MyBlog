import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
    // 1. Loader 配置保持不变，这是目前性能最好的方式
    loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
    
    schema: ({ image }) =>
        z.object({
            // 2. 限制标题长度，有利于 SEO
            title: z.string().max(60, "标题最好不要超过 60 个字符"),
            
            description: z.string().max(160, "描述最好不要超过 160 个字符以优化搜索展示"),
            
            // 3. 强制日期转换
            pubDate: z.coerce.date(),
            updatedDate: z.coerce.date().optional(),
            
            // 4. 图片优化：使用 image() 助手处理本地图片， Astro 会自动压缩
            heroImage: image().optional(),
            heroImageAlt: z.string().optional(), // 最佳实践：为封面图提供 Alt 文字

            // 5. 增加标签（数组枚举）
            // .default([]) 确保即使没写 tags，代码运行也不会报错
            tags: z.array(z.string()).default([]),

            // 6. 增加分类（限定范围）
            category: z.enum(['技术', '生活', '杂谈']).default('杂谈'),

            // 7. 草稿功能
            // 这样你可以在查询时过滤掉 draft: true 的文章
            draft: z.boolean().default(false),

            // 8. 规范化 URL（可选）
            // 如果你想自定义 URL 路径，可以加这个字段
            canonicalURL: z.string().url().optional(),
        }),
});

export const collections = { blog };