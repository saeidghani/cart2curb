import React, {useState} from 'react';
import {Button, message, Upload, Form, Input, Row, Col} from 'antd';
import {useRouter} from "next/router";
import Link from "next/link";
import ImgCrop from "antd-img-crop";
import {useDispatch, useSelector} from "react-redux";

const {Item} = Form;

import routes from "../../../constants/routes";

const Video = props => {
    const dispatch = useDispatch();
    const loading = useSelector(state => state.loading.effects.adminProfile.addCategory);
    const token = useSelector(state => state?.adminAuth?.token);
    const router = useRouter();
    const [leftImageUrl, setLeftImageUrl] = useState('');
    const [rightImageUrl, setRightImageUrl] = useState('');

    const submitHandler = async (values) => {
        console.log(values);
        const {name, parent, description} = values;
        const body = {
            name, parent, description
        }

        /*const res = await dispatch.adminProfile.addVideo({body, token});
        if (res) {
            router.push({pathname: routes.admin.profile.index, query: {tab: 'video'}});
        }*/
    };

    function beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    }

    const handleLeftImgUpload = info => {
        if (info.file.status === 'uploading') {
            return;
        }
        if (info.file.status === 'done') {
            setLeftImageUrl(`${process.env.NEXT_PUBLIC_API_BASE_URL}v1/files/photos${info.file.response.data.path}`);
        }
    };

    const handleRightImgUpload = info => {
        if (info.file.status === 'uploading') {
            return;
        }
        if (info.file.status === 'done') {
            setRightImageUrl(`${process.env.NEXT_PUBLIC_API_BASE_URL}v1/files/photos${info.file.response.data.path}`);
        }
    };

    const uploadProps = {
        action: '/v1/files/photos/',
        headers: {
            Authorization: `Bearer ${token}`
        },

        progress: {
            strokeColor: {
                '0%': '#ff4b45',
                '100%': '#87d068',
            },
            strokeWidth: 2,
            format: percent => `${parseFloat(percent.toFixed(2))}%`,
        },
    }

    const UploadVideo = ({imageUrl, onUpload}) => (<ImgCrop>
        <Upload
            name="photo"
            listType="picture-card"
            className="avatar-uploader-wrapper border-0"
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={onUpload}
            {...uploadProps}
        >
            <div className="">
                {imageUrl && <img src={imageUrl} alt="avatar" style={{width: 580, height: 340}}/>}
            </div>
            {!imageUrl && <div
                className={'full-rounded text-overline bg-card flex items-center justify-center'}
                style={{width: 580, height: 340}}>
            </div>}
        </Upload>
    </ImgCrop>);

    return (
        <div className="py-5 flex flex-col" style={{position: 'relative', top: 110, height: 460}}>
            <div className="flex flex-col">
                <div className="mb-6 font-bold" style={{position: 'relative', top: '-125px'}}>Upload Your Videos</div>
                <div className="flex space-x-2 mt-3">
                    <UploadVideo imageUrl={leftImageUrl} onUpload={handleLeftImgUpload}/>
                    <UploadVideo imageUrl={rightImageUrl} onUpload={handleRightImgUpload}/>
                </div>
            </div>
            <div className="flex justify-end space-x-2" style={{position: 'relative', top: 150}}>
                <Item>
                    <Button
                        type="primary"
                        block
                        className='w-full md:w-32 ml-0 md:ml-5'
                        htmlType={'submit'}
                        loading={loading}
                    >
                        Save
                    </Button>
                </Item>
                <Item>
                    <Link
                        href={{pathname: routes.admin.profile.index, query: {tab: 'video'}}}
                    >
                        <Button danger className='w-full md:w-32'>Cancel</Button>
                    </Link>
                </Item>
            </div>
        </div>
    )
};

export default Video;