"use client"

import React, {useEffect, useState} from 'react';
import dynamic from 'next/dynamic';
import {OutputData} from '@editorjs/editorjs';
import {Card, CardBody, CardFooter, CardHeader} from "@heroui/card";
import {useRouter} from 'next/navigation';
import {DocsSidebar} from "@/components/docs-sidebar";
import {
	ApiError, deleteDocs,
	fetchDocs, putDocs
} from "@/lib/api";
import {Doc} from "@/types/doc";
import {Button} from "@heroui/button";
import {Divider} from "@heroui/divider";
import {Input} from "@heroui/react";

const Editor = dynamic(() => import('@/components/editor'), {ssr: false});

export const DocsEditor = () => {
	const router = useRouter()

	const [queryDocId, setQueryDocId] = useState<any>()
	const [docs, setDocs] = useState<any>();
	const [doc, setDoc] = useState<any>();
	const [docName, setDocName] = useState<string>()
	const [isEdited, setIsEdited] = useState<boolean>(false)
	const [isDelete, setIsDelete] = useState<boolean>(false)

	const [editorContent, setEditorContent] = useState<OutputData>()
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadDoc = (docs:Doc[], docId:number) => {
		if (docId) {
			const docById = docs?.find((doc: Doc) => doc.id === docId);
			setDoc(docById)
			setEditorContent(docById?.content)
			setDocName(docById?.name)
			return docById
		} else {
			return null
		}
	}

	const loadDocs = async (id?:number) => {
		try {
			setError(null);
			const data = await fetchDocs();

			setDocs(data);

			if (id) {
				loadDoc(data, Number(id))
			}
		} catch (err) {
			if (err instanceof ApiError) {
				setError(err.message);
			} else {
				setError('Произошла неизвестная ошибка');
			}
		} finally {
			setLoading(false)
		}
	};

	useEffect(() => {
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);

		setQueryDocId(urlParams.get('id'))
		setLoading(true);
		loadDocs(Number(urlParams.get('id')));
	}, []);

	if (loading) {
		return (
			<div className="flex">
				Loading...
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex">
				<h2 className="text-xl font-bold text-danger mb-2">Ошибка загрузки</h2>
				<p className="text-default-600">{error}</p>
			</div>
		);
	}

	return (
		<div className={'docs-wrapper w-full flex gap-5 h-full pb-4'}>
			<div className={'docs-sidebar w-100'}>
				<DocsSidebar docs={docs} docId={queryDocId} setDoc={setDoc} loadDocs={loadDocs} router={router} />
			</div>
			<div className={'docs-content flex-1'}>
				<Card className={'docs-editor h-full shadow-medium'}>
					{doc ? (
						<>
							<CardHeader className={'justify-end gap-2'}>
								<Input className={'docs-heading-input'} value={docName} variant={'underlined'} size={'sm'} onChange={(e) => {
									setIsEdited(true)
									setDocName(e.target.value)
								}} />
							</CardHeader>
							<Divider />
						</>
					) : null}
					<CardBody className={'docs-editor-body overflow-auto'} style={{height: 'calc(100vh - 214px)'}}>
						{doc ? (
							<div className={'docs-editor-wrapper'}>
								<Editor data={editorContent} readOnly={false} docId={doc.id} onChange={(data: OutputData) => {
									const defaultImageBlocks = editorContent?.blocks ? editorContent?.blocks.filter(block => block.type === 'image') : []
									const updatedImageBlocks = data.blocks ? data.blocks.filter(block => block.type === 'image') : []

									setIsEdited(true)

									if (defaultImageBlocks?.length !== updatedImageBlocks?.length) {
										putDocs(doc.id, {
											content: data
										}).catch((err) => {
											console.log(err)
										}).finally(() => {
											setIsEdited(false)
											loadDocs(doc.id)
										})
									}

									setEditorContent(data)
								}}/>
							</div>
						) : null}
					</CardBody>
					{doc ? (
						<>
							<Divider />
							<CardFooter className={'justify-end gap-2'}>
								{!isDelete ? (
									<Button type="submit" variant="bordered" onPress={() => {
										setIsDelete(true)
									}}>
										Удалить
									</Button>
								) : (
									<Button type="submit" variant="bordered" color={'danger'} onPress={() => {
										deleteDocs(doc.id).catch((err) => {
											console.log(err)
										}).finally(() => {
											setIsDelete(false)
											loadDocs(doc.id)
											router.push('/docs')
										})
									}}>
										Да удалить
									</Button>
								)}


								{isEdited ? (
									<Button type="submit" variant="bordered" onPress={() => {
										putDocs(doc.id, {
											name: docName,
											content: editorContent
										}).catch((err) => {
											console.log(err)
										}).finally(() => {
											setIsEdited(false)
											loadDocs(doc.id)
										})
									}}>
										Сохранить
									</Button>
								) : null }
							</CardFooter>
						</>
					) : null}
				</Card>
			</div>
		</div>
	);
};