"use client"
import React, {useEffect, useState} from "react";
import {Form, Input, Button, Listbox, ListboxItem} from "@heroui/react";
import {Card, CardBody, CardFooter, CardHeader} from "@heroui/card";
import {Divider} from "@heroui/divider";
import {postDocs} from "@/lib/api";

export const DocsSidebar = ({docs, docId, setDoc, loadDocs, router}:any) => {
	const [currentDocId, setCurrentDocId] = useState<number>(docId);
	const [docNameValue, setDocNameValue] = useState<string>('')

	const [defaultDocId, setDefaultDocId] = useState<string|null>(null);

	useEffect(() => {
		setDefaultDocId(localStorage?.getItem('defaultDocumentId'))
	}, [])

	const onSubmit = (e:any) => {
		e.preventDefault();

		const data = Object.fromEntries(new FormData(e.currentTarget));

		postDocs({
			name: data.docName,
		}).then((doc:any) => {
			setDoc(null)
			loadDocs(doc.id)
			setCurrentDocId(doc.id)
			router.push(`?id=${doc.id}`)
		}).catch((err) => {
			console.log(err)
		}).finally(() => {
			setDocNameValue('')
		});
	};

	return (
		<Card className={'docs-nav h-full shadow-medium'}>
			<CardHeader className="flex gap-3">
				<div className="flex justify-between items-center w-full">
					<p className="text-md">Документы</p>
					{currentDocId ? (
						<Button className={'min-h-auto h-6'} onPress={() => {
							if (!defaultDocId) {
								setDefaultDocId(currentDocId.toString())
								localStorage.setItem('defaultDocumentId', currentDocId.toString())
								document.getElementById('docs-link')?.setAttribute('href', `/docs?id=${currentDocId}`)
							} else {
								setDefaultDocId(null)
								localStorage.removeItem('defaultDocumentId')
								document.getElementById('docs-link')?.setAttribute('href', `/docs`)
							}
						}}>
							{defaultDocId === currentDocId.toString() ? 'Основной' : 'Сделать основным'}
						</Button>
					) : null}
				</div>
			</CardHeader>
			<Divider />
			<CardBody className={'docs-nav-body overflow-auto'} style={{height: 'calc(100vh - 214px)'}}>
				<Listbox
					aria-label="Actions"
					selectionMode="single"
					variant="light"
					selectedKeys={[`${currentDocId}`]}
					disabledKeys={[`${currentDocId}`]}
				>
					{docs && docs.length ? (
						docs.map((doc: any, index:number) => (
							<ListboxItem key={doc.id} href={`?id=${doc.id}`} onClick={async (e) => {
								e.preventDefault()
								setCurrentDocId(doc.id)
								setDoc(null)
								loadDocs(doc.id)
							}}>{doc.name}</ListboxItem>
						))
					) : (
						<ListboxItem key={0} isDisabled={true}>Добавьте документ</ListboxItem>
					)}
				</Listbox>
			</CardBody>
			<Divider />
			<CardFooter>
				<Form className="w-full flex-row" onSubmit={onSubmit}>
					<Input
						isRequired
						errorMessage="Проверьте правильность введенных данных"
						minLength={3}
						name="docName"
						placeholder="Название документа"
						type="text"
						value={docNameValue}
						autoComplete={'off'}
						onChange={(e: any) => {
							setDocNameValue(e.target.value)
						}}
					/>
					<Button type="submit" variant="bordered">
						Добавить
					</Button>
				</Form>
			</CardFooter>
		</Card>
	);
};
