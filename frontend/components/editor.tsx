'use client';

import {useEffect, useRef} from 'react';
import EditorJS, {OutputData} from '@editorjs/editorjs';
import Header from '@/components/docs-editor-header';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import {putDocs} from "@/lib/api";

interface EditorProps {
	data?: OutputData;
	onChange?: (data: OutputData) => void;
	editorId?: string;
	readOnly?:boolean;
	docId?:number;
}

export default function Editor({ data, onChange, readOnly, editorId = 'editorjs', docId }: EditorProps) {
	const editorRef = useRef<EditorJS | null>(null);

	useEffect(() => {
		if (!editorRef.current) {
			editorRef.current = new EditorJS({
				holder: editorId,
				data: data,
				readOnly: readOnly,
				placeholder: 'Начните писать...',
				tools: {
					header: {
						// @ts-ignore
						class: Header,
						inlineToolbar: true,
					},
					list: {
						class: List,
						inlineToolbar: true,
					},
					image: {
						class: ImageTool,
						config: {
							uploader: {
								uploadByFile: async (file:File) => {
									const formData = new FormData();
									formData.append('image', file);

									const response = await fetch(`${process.env.NEXT_PUBLIC_REST_API}/docs/upload-image`, { // Your Next.js API route
										method: 'PATCH',
										body: formData,
									});

									const uploadedImageURL = await response.text();

									if (uploadedImageURL) {


										return {
											success: 1,
											file: {
												url: `${process.env.NEXT_PUBLIC_REST_API}${uploadedImageURL}`,
											},
										};
									} else {
										console.error('Image upload failed:', uploadedImageURL);
										return { success: 0 };
									}
								}
							}
						}
					}
				},
				onChange: async () => {
					if (onChange && editorRef.current) {
						const content = await editorRef.current.save();
						onChange(content);
					}
				},
			});
		}

		return () => {
			if (editorRef.current && editorRef.current.destroy) {
				editorRef.current.destroy();
				editorRef.current = null;
			}
		};
	}, []);

	return <div id={editorId} />;
}